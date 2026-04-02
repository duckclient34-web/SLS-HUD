"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPanel, { type ScriptItem } from "./components/AdminPanel";

type Category = "script" | "fflags" | "desync" | "async";
type Media = { type: "image"; src: string; alt: string };
type DisplayItem = ScriptItem & { media?: Media };

const BASE_SCRIPTS: DisplayItem[] = [
  {
    slug: "duck-client",
    name: "Duck Client",
    description: "Script loader.",
    category: "script",
    tags: ["loader"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://project-fq58s.vercel.app/api/script?token=DuckClient2026"))()',
    media: { type: "image", src: "/scripts/duck-client.webp", alt: "Duck Client preview" },
  },
  {
    slug: "lock-in",
    name: "Lock In",
    description:
      "Lock in script is a script for FSS/SLS which allows defenders and gks with poop prediction lock in by locking onto the ball itself.",
    category: "script",
    tags: ["fss", "sls", "gk", "defender"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://raw.githubusercontent.com/Cortzalno666/NectoVerse-Industries-Data/refs/heads/master/Scripts%20Folder/Lock%20in.lol"))()',
    repoUrl: "https://github.com/Cortzalno666/NectoVerse-Industries-Data",
  },
];

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

const CATEGORY_ORDER: Category[] = ["script", "fflags", "desync", "async"];

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  return (
    <button
      type="button"
      className="btn btnPrimary"
      onClick={async () => {
        try {
          await copyText(text);
          setState("copied");
          window.setTimeout(() => setState("idle"), 1200);
        } catch {
          setState("error");
          window.setTimeout(() => setState("idle"), 1500);
        }
      }}
      aria-label="Copy to clipboard"
      style={{ cursor: "pointer" }}
    >
      {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy"}
    </button>
  );
}

function MediaPreview({ media, title }: { media: Media; title: string }) {
  return (
    <div
      style={{
        margin: "0 0 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        overflow: "hidden",
        background: "rgba(0,0,0,0.20)",
      }}
    >
      <Image
        src={media.src}
        alt={media.alt || title}
        width={1200}
        height={675}
        style={{ width: "100%", height: "auto", display: "block" }}
        priority={false}
      />
    </div>
  );
}

export default function Page() {
  const { data: session } = useSession();
  const isAdmin = Boolean((session?.user as any)?.isAdmin);

  const [universalScripts, setUniversalScripts] = useState<DisplayItem[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");

  async function reloadUniversal() {
    setLoadState("loading");
    try {
      const res = await fetch("/api/scripts", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setUniversalScripts((data.items as DisplayItem[]) || []);
      setLoadState("idle");
    } catch {
      setLoadState("error");
    }
  }

  useEffect(() => {
    reloadUniversal();
  }, []);

  const allScripts = useMemo(() => {
    const bySlug = new Map<string, DisplayItem>();
    for (const s of BASE_SCRIPTS) bySlug.set(s.slug, s);
    for (const s of universalScripts) bySlug.set(s.slug, s); // universal overrides base if same slug
    return Array.from(bySlug.values());
  }, [universalScripts]);

  const byCategory = useMemo(() => {
    return Object.fromEntries(
      CATEGORY_ORDER.map((c) => [c, allScripts.filter((s) => s.category === c)])
    ) as Record<Category, DisplayItem[]>;
  }, [allScripts]);

  return (
    <main>
      <section className="hero">
        <h1 className="h1">Fuck SLS HUD</h1>
        <p className="p">
          Universal scripts load from GitHub. {loadState === "loading" ? "Loading…" : loadState === "error" ? "Load failed." : ""}
        </p>

        <div className="badges">
          <span className="badge">script</span>
          <span className="badge">fflags</span>
          <span className="badge">desync</span>
          <span className="badge">async</span>
        </div>
      </section>

      {isAdmin && (
        <AdminPanel
          count={universalScripts.length}
          onAdded={(items) => {
            setUniversalScripts(items as DisplayItem[]);
          }}
        />
      )}

      <section id="scripts" className="section">
        <h2 className="sectionTitle">Scripts</h2>

        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="section" style={{ marginTop: 14 }}>
            <h3 className="sectionTitle" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
              {cat} ({byCategory[cat].length})
            </h3>

            <div className="grid">
              {byCategory[cat].map((s) => (
                <article key={s.slug} className="card">
                  <div className="cardTop">
                    <h3 className="cardTitle">{s.name}</h3>
                    <span className="pill">{s.category}</span>
                  </div>

                  <p className="cardDesc">{s.description}</p>

                  {s.media && <MediaPreview media={s.media} title={s.name} />}

                  {s.script && (
                    <div style={{ margin: "0 0 12px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <CopyButton text={s.script} />
                      </div>

                      <pre
                        style={{
                          margin: "10px 0 0",
                          padding: 12,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(0,0,0,0.20)",
                          color: "rgba(255,255,255,0.86)",
                          overflowX: "auto",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          fontSize: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        <code>{s.script}</code>
                      </pre>
                    </div>
                  )}

                  <div className="meta">
                    {s.tags.map((t) => (
                      <span key={t} className="kv">
                        #{t}
                      </span>
                    ))}
                    <span className="kv">Updated {formatDate(s.updated)}</span>

                    <div className="links">
                      {s.repoUrl && (
                        <a className="btn" href={s.repoUrl} target="_blank" rel="noreferrer">
                          Repo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
