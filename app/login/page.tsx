"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main style={{ minHeight: "calc(100vh - 120px)", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: "min(920px, 100%)",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 14,
        }}
      >
        <section className="hero" style={{ marginTop: 0 }}>
          <div className="pill" style={{ display: "inline-flex", marginBottom: 12 }}>
            Secure access
          </div>

          <h1 className="h1" style={{ marginBottom: 10 }}>
            Sign in with Discord
          </h1>

          <p className="p" style={{ marginBottom: 18 }}>
            You must be logged in to view the site. If you’re blacklisted, you’ll be blocked after
            sign-in.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              className="btn btnPrimary"
              onClick={() => signIn("discord", { callbackUrl: "/" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 14,
                fontWeight: 700,
              }}
            >
              <DiscordMark />
              Continue with Discord
            </button>

            <span className="kv">You’ll be redirected back automatically.</span>
          </div>
        </section>

        <aside className="card" style={{ gridColumn: "span 1" }}>
          <div style={{ fontWeight: 750, marginBottom: 10 }}>Why Discord?</div>

          <ul style={{ margin: 0, paddingLeft: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            <li>Quick sign-in, no password here</li>
            <li>Admins can manage scripts & blacklist</li>
            <li>Safer than sharing private links</li>
          </ul>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div className="kv">
              Tip: if login fails, check Discord OAuth redirect URL ends with{" "}
              <code>/api/auth/callback/discord</code>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function DiscordMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14h0C130.9,52.84,123.5,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}
