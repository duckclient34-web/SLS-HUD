import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN;
const filePath = "data/blacklist.json";

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

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as any)?.isAdmin);
  if (!isAdmin) return null;
  return session;
}

async function readList(): Promise<{ ids: string[]; sha: string }> {
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

  if (!Array.isArray(parsed)) throw new Error("blacklist.json must be a JSON array");
  const ids = parsed.map((x) => String(x).trim()).filter(Boolean);
  return { ids, sha: data.sha };
}

async function writeList(ids: string[], sha: string) {
  if (!repo || !token) throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN");

  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filePath)}`;
  const content = Buffer.from(JSON.stringify(ids, null, 2) + "\n", "utf8").toString("base64");

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
    const { ids } = await readList();
    return NextResponse.json({ ids });
  } catch (e: any) {
    return apiError(e?.message ?? "Failed to load blacklist");
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return apiError("Forbidden", 403);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON", 400);
  }

  const id = String(body?.id ?? "").trim();
  if (!id) return apiError("Missing id", 400);

  try {
    const { ids, sha } = await readList();
    const set = new Set(ids);
    set.add(id);
    const next = Array.from(set);
    await writeList(next, sha);
    return NextResponse.json({ ok: true, ids: next });
  } catch (e: any) {
    return apiError(e?.message ?? "Failed to add to blacklist");
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return apiError("Forbidden", 403);

  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim();
  if (!id) return apiError("Missing id", 400);

  try {
    const { ids, sha } = await readList();
    const next = ids.filter((x) => x !== id);
    await writeList(next, sha);
    return NextResponse.json({ ok: true, ids: next });
  } catch (e: any) {
    return apiError(e?.message ?? "Failed to remove from blacklist");
  }
}
