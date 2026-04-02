"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "script" | "fflags";

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
  scripts,
  onScriptsUpdated,
}: {
  scripts: ScriptItem[];
  onScriptsUpdated: (items: ScriptItem[]) => void;
}) {
  // add script form
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("script");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [updated, setUpdated] = useState(todayISO());
  const [script, setScript] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const suggestedSlug = useMemo(() => slugify(name) || "new-script", [name]);

  // blacklist
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [blId, setBlId] = useState("");
  const [blStatus, setBlStatus] = useState<"idle" | "saving" | "error">("idle");

  async function reloadBlacklist() {
    try {
      const res = await fetch("/api/blacklist", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.ids)) setBlacklist(data.ids);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    reloadBlacklist();
  }, []);

  return (
    <div className="hero" style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 750, marginBottom: 6 }}>Admin Panel</div>
      <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
        Add/delete scripts universally + manage blacklist.
      </div>

      {/* Add script */}
      <div className="card" style={{ gridColumn: "span 12", marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="sectionTitle">Add a script (universal)</div>
          <span className="pill">
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Ready"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, marginTop: 10 }}>
          <div style={{ gridColumn: "span 6" }}>
            <div className="sectionTitle">Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="sectionTitle">Category</div>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} style={inputStyle}>
              <option value="script">script</option>
              <option value="fflags">fflags</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="sectionTitle">Updated</div>
            <input value={updated} onChange={(e) => setUpdated(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div className="sectionTitle">Description</div>
            <input value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <div className="sectionTitle">Tags (comma separated)</div>
            <input value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <div className="sectionTitle">Repo URL (optional)</div>
            <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div className="sectionTitle">Image path/URL (optional)</div>
            <input value={imagePath} onChange={(e) => setImagePath(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div className="sectionTitle">Script / JSON (optional)</div>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} />
          </div>

          <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span className="kv">Slug: {suggestedSlug}</span>

            <button
              className="btn btnPrimary"
              type="button"
              onClick={async () => {
                const item: ScriptItem = {
                  slug: suggestedSlug,
                  name: name.trim(),
                  description: description.trim(),
                  category,
                  tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                  updated: (updated || todayISO()).trim(),
                  script: script.trim() || undefined,
                  repoUrl: repoUrl.trim() || undefined,
                  media: imagePath.trim()
                    ? { type: "image", src: imagePath.trim(), alt: `${name.trim() || suggestedSlug} preview` }
                    : undefined,
                };

                if (!item.name || !item.description) return;

                setStatus("saving");
                try {
                  const res = await fetch("/api/scripts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || "Save failed");

                  onScriptsUpdated(data.items as ScriptItem[]);
                  setStatus("saved");
                  window.setTimeout(() => setStatus("idle"), 1200);

                  setName("");
                  setDescription("");
                  setTags("");
                  setScript("");
                  setRepoUrl("");
                  setImagePath("");
                  setCategory("script");
                  setUpdated(todayISO());
                } catch {
                  setStatus("error");
                  window.setTimeout(() => setStatus("idle"), 1500);
                }
              }}
            >
              Add script
            </button>
          </div>
        </div>
      </div>

      {/* Delete script */}
      <div className="card" style={{ gridColumn: "span 12", marginTop: 12 }}>
        <div className="sectionTitle">Delete a script (universal)</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10, marginTop: 10 }}>
          <div style={{ gridColumn: "span 12", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {scripts.map((s) => (
              <button
                key={s.slug}
                type="button"
                className="btn"
                onClick={async () => {
                  if (!confirm(`Delete "${s.name}" (${s.slug})?`)) return;
                  try {
                    const res = await fetch(`/api/scripts?slug=${encodeURIComponent(s.slug)}`, {
                      method: "DELETE",
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Delete failed");
                    onScriptsUpdated(data.items as ScriptItem[]);
                  } catch {
                    alert("Delete failed. Check Vercel logs.");
                  }
                }}
              >
                Delete: {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blacklist */}
      <div className="card" style={{ gridColumn: "span 12", marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="sectionTitle">Blacklist Discord IDs (blocked from viewing)</div>
          <span className="pill">
            {blStatus === "saving" ? "Saving…" : blStatus === "error" ? "Failed" : "Ready"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <input
            value={blId}
            onChange={(e) => setBlId(e.target.value)}
            placeholder="Discord user ID"
            style={{ ...inputStyle, width: 320 }}
          />
          <button
            className="btn btnPrimary"
            type="button"
            onClick={async () => {
              const id = blId.trim();
              if (!id) return;
              setBlStatus("saving");
              try {
                const res = await fetch("/api/blacklist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed");
                setBlacklist(data.ids as string[]);
                setBlId("");
                setBlStatus("idle");
              } catch {
                setBlStatus("error");
                window.setTimeout(() => setBlStatus("idle"), 1500);
              }
            }}
          >
            Add to blacklist
          </button>

          <button className="btn" type="button" onClick={reloadBlacklist}>
            Refresh
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {blacklist.map((id) => (
            <button
              key={id}
              type="button"
              className="btn"
              onClick={async () => {
                setBlStatus("saving");
                try {
                  const res = await fetch(`/api/blacklist?id=${encodeURIComponent(id)}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || "Failed");
                  setBlacklist(data.ids as string[]);
                  setBlStatus("idle");
                } catch {
                  setBlStatus("error");
                  window.setTimeout(() => setBlStatus("idle"), 1500);
                }
              }}
            >
              Unblacklist: {id}
            </button>
          ))}
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
