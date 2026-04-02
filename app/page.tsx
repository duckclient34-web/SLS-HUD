type ScriptItem = {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  language: string;
  updated: string;
  repoUrl?: string;
  demoUrl?: string;
};

const SCRIPTS: ScriptItem[] = [
  {
    slug: "log-cleaner",
    name: "Log Cleaner",
    summary: "Cleans noisy logs and extracts key lines into a neat output file.",
    tags: ["cli", "automation"],
    language: "Python",
    updated: "2026-04-02",
    repoUrl: "https://github.com/yourname/log-cleaner"
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    summary: "Batch resizes images into web-friendly sizes for faster pages.",
    tags: ["media", "batch"],
    language: "Node.js",
    updated: "2026-03-18",
    repoUrl: "https://github.com/yourname/image-resizer"
  }
];

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  } catch {
    return iso;
  }
}

export default function Page() {
  return (
    <main>
      <section className="hero">
        <h1 className="h1">Showcase your scripts</h1>
        <p className="p">
          A simple, clean website to list your scripts with quick details and links.
          Edit the <code>SCRIPTS</code> array to add/remove projects.
        </p>

        <div className="badges">
          <span className="badge">Fast</span>
          <span className="badge">Mobile-friendly</span>
          <span className="badge">Deployed on Vercel</span>
          <span className="badge">Easy to update</span>
        </div>
      </section>

      <section id="scripts" className="section">
        <h2 className="sectionTitle">Scripts</h2>

        <div className="grid">
          {SCRIPTS.map((s) => (
            <article key={s.slug} className="card">
              <div className="cardTop">
                <h3 className="cardTitle">{s.name}</h3>
                <span className="pill">{s.language}</span>
              </div>

              <p className="cardDesc">{s.summary}</p>

              <div className="meta">
                {s.tags.map((t) => (
                  <span key={t} className="kv">#{t}</span>
                ))}
                <span className="kv">Updated {formatDate(s.updated)}</span>

                <div className="links">
                  {s.repoUrl && (
                    <a className="btn" href={s.repoUrl} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  )}
                  {s.demoUrl && (
                    <a className="btn btnPrimary" href={s.demoUrl} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <h2 className="sectionTitle">About</h2>
        <div className="hero">
          <p className="p">
            Replace the GitHub links with your real repos. Any commit to GitHub will redeploy on Vercel.
          </p>
        </div>
      </section>
    </main>
  );
}
