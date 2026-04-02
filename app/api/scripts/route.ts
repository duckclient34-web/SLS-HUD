import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

type Category = "script" | "fflags" | "desync" | "async";

type ScriptItem = {
  slug: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  updated: string;
  script?: string;
  repoUrl?: string;
  media?: { type: "image"; src: string; alt: string };
};

const repo = process.env.GITHUB_REPO; // owner/name
const branch = process.env.GITHUB_BRANCH || "main";
const filePath = process.env.GITHUB_FILE_PATH || "data/scripts.json";
const token = process.env.GITHUB_TOKEN;

function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    Accept: "application/vnd.github+json",
  };
}

async function readGithubJson(): Promise<{ items: ScriptItem[]; sha: string }> {
  if (!repo || !token) throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN");

  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(
    filePath
  )}?ref=${encodeURIComponent(branch)}`;

  const res = await fetch(url, { headers: githubHeaders(), cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { content: string; sha: string };
  const raw = Buffer.from(data.content, "base64").toString("utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) throw new Error("scripts.json must be a JSON array");
  return { items: parsed as ScriptItem[], sha: data.sha };
}

async function writeGithubJson(items: ScriptItem[], sha: string) {
  if (!repo || !token) throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN");

  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filePath)}`;
  const content = Buffer.from(JSON.stringify(items, null, 2) + "\n", "utf8").toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Update ${filePath} via admin panel`,
      content,
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }
}

export async function GET() {
  try {
    const { items } = await readGithubJson();
    return NextResponse.json({ items });
  } catch (e: any) {
    return apiError(e?.message ?? "Failed to load scripts");
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as any)?.isAdmin);
  if (!isAdmin) return apiError("Forbidden", 403);

  let incoming: ScriptItem;
  try {
    incoming = (await req.json()) as ScriptItem;
  } catch {
    return apiError("Invalid JSON", 400);
  }

  if (!incoming?.slug || !incoming?.name || !incoming?.description || !incoming?.category) {
    return apiError("Missing required fields", 400);
  }

  try {
    const { items, sha } = await readGithubJson();
    const next = [incoming, ...items.filter((x) => x.slug !== incoming.slug)];
    await writeGithubJson(next, sha);
    return NextResponse.json({ ok: true, items: next });
  } catch (e: any) {
    return apiError(e?.message ?? "Failed to save script");
  }
}
