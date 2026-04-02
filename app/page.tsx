type Category = "fflags" | "desync" | "async";

type ScriptItem = {
  slug: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  updated: string;
  script?: string; // the loadstring line
  repoUrl?: string;
};

const SCRIPTS: ScriptItem[] = [
  {
    slug: "duck-client",
    name: "Duck Client",
    description: "Script loader.",
    category: "fflags",
    tags: ["loader"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://project-fq58s.vercel.app/api/script?token=DuckClient2026"))()',
  },
  {
    slug: "lock-in",
    name: "Lock In",
    description:
      "Lock in script is a script for FSS/SLS which allows defenders and gks with poop prediction lock in by locking onto the ball itself.",
    category: "async",
    tags: ["fss", "sls", "gk", "defender"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://raw.githubusercontent.com/Cortzalno666/NectoVerse-Industries-Data/refs/heads/master/Scripts%20Folder/Lock%20in.lol"))()',
    repoUrl:
      "https://github.com/Cortzalno666/NectoVerse-Industries-Data",
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

const CATEGORY_ORDER: Category[] = ["fflags", "desync", "async"];

export default function Page() {
  const byCategory = Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, SCRIPTS.filter((s) => s.category === c)])
  ) as Record<Category, ScriptItem[]>;

  return (
    <main>
      <section className="hero">
        <h1 className="h1">Script Showcase</h1>
        <p className="p">
          Categories: <code>fflags</code>, <code>desync</code>, <code>async</code>. Edit{" "}
          <code>SCRIPTS</code> to add more.
        </p>

        <div className="badges">
          <span className="badge">fflags</span>
          <span className="badge">desync</span>
          <span className="badge">async</span>
        </div>
      </section>

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

                  {s.script && (
                    <pre
                      style={{
                        margin: "0 0 12px",
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
