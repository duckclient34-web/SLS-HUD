import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const RAW_BASE = process.env.GITHUB_RAW_BASE;

async function getBlacklist(): Promise<Set<string>> {
  if (!RAW_BASE) return new Set();
  const url = `${RAW_BASE}/data/blacklist.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return new Set();
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return new Set();
  return new Set(data.map((x) => String(x).trim()).filter(Boolean));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next-auth + next internal files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // require login for everything else
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If admin, never block
  const isAdmin = Boolean((token as any).isAdmin);
  if (isAdmin) return NextResponse.next();

  const discordId =
    (token as any).discordId ??
    (typeof token.sub === "string" ? token.sub : undefined);

  if (discordId) {
    const blacklist = await getBlacklist();
    if (blacklist.has(String(discordId))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
