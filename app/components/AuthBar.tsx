"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthBar() {
  const { data: session, status } = useSession();
  const isAdmin = Boolean((session?.user as any)?.isAdmin);

  if (status === "loading") {
    return <span className="pill">Loading…</span>;
    }

  if (status !== "authenticated") {
    return (
      <button className="btn btnPrimary" onClick={() => signIn("discord")}>
        Login with Discord
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span className="pill" title={(session?.user as any)?.discordId ?? ""}>
        {session?.user?.name}
        {isAdmin ? " (Admin)" : ""}
      </span>
      <button className="btn" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
}
