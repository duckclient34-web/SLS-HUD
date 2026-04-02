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

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Allow the custom login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If not logged in, send to nice login page
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admins can never be blocked
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
