"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "script" | "fflags" | "desync" | "async";

export type ScriptItem = {
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminPanel({
  onAdd,
  onClear,
  count,
}: {
  onAdd: (item: ScriptItem) => void;
  onClear: () => void;
  count: number;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("script");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [updated, setUpdated] = useState(todayISO());
  const [script, setScript] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [imagePath, setImagePath] = useState(""); // e.g. /scripts/my.png or https://...

  const suggestedSlug = useMemo(() => slugify(name) || "new-script", [name]);

  useEffect(() => {
    if (!updated) setUpdated(todayISO());
  }, [updated]);

  return (
    <div className="hero" style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 750, marginBottom: 6 }}>Admin: Add a script</div>
          <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
            Saves to this browser only (localStorage). Current admin-added: {count}
          </div>
        </div>

        <button className="btn" onClick={onClear} type="button">
          Clear admin-added
        </button>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card" style={{ gridColumn: "span 12" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
            <div style={{ gridColumn: "span 6" }}>
              <div className="sectionTitle">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Script"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <div className="sectionTitle">Category</div>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} style={inputStyle}>
                <option value="script">script</option>
                <option value="fflags">fflags</option>
                <option value="desync">desync</option>
                <option value="async">async</option>
              </select>
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <div className="sectionTitle">Updated (YYYY-MM-DD)</div>
              <input value={updated} onChange={(e) => setUpdated(e.target.value)} placeholder="2026-04-02" style={inputStyle} />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <div className="sectionTitle">Description</div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="1–2 lines describing it"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 6" }}>
              <div className="sectionTitle">Tags (comma separated)</div>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. fss, gk, defender"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 6" }}>
              <div className="sectionTitle">Repo URL (optional)</div>
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <div className="sectionTitle">Image path/URL (optional)</div>
              <input
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder='e.g. /scripts/duck-client.webp'
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <div className="sectionTitle">Script / JSON (optional)</div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste loadstring(...)() or JSON here"
                style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
              />
            </div>

            <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <span className="kv">Slug: {suggestedSlug}</span>

              <button
                className="btn btnPrimary"
                type="button"
                onClick={() => {
                  const slug = suggestedSlug;

                  const item: ScriptItem = {
                    slug,
                    name: name.trim(),
                    description: description.trim(),
                    category,
                    tags: tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                    updated: (updated || todayISO()).trim(),
                    script: script.trim() || undefined,
                    repoUrl: repoUrl.trim() || undefined,
                    media: imagePath.trim()
                      ? { type: "image", src: imagePath.trim(), alt: `${name.trim() || slug} preview` }
                      : undefined,
                  };

                  if (!item.name || !item.description) return;

                  onAdd(item);

                  setName("");
                  setDescription("");
                  setTags("");
                  setScript("");
                  setRepoUrl("");
                  setImagePath("");
                  setCategory("script");
                  setUpdated(todayISO());
                }}
              >
                Add script
              </button>
            </div>
          </div>

          <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, marginTop: 10 }}>
            Tip: To host images, upload to GitHub under <code>public/scripts/</code> and use <code>/scripts/filename.webp</code>.
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.20)",
  color: "rgba(255,255,255,0.90)",
  outline: "none",
};
