import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // present but not used yet (we’ll wire edit/mask next)
  const [sourceFile] = useState<File | null>(null);
  const [maskFile] = useState<File | null>(null);

  async function getUserId(): Promise<string | undefined> {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      const user_id = await getUserId();

      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id, name, prompt })
      });

      const text = await res.text();
      let json: any = {};
      try { json = JSON.parse(text || "{}"); } catch { /* non-JSON */ }

      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      setOk("Created!");
      // Optionally navigate to /navatar?refresh=1
      // window.location.href = "/navatar?refresh=1";
    } catch (e: any) {
      setErr(e?.message || "Create failed");
      alert(e?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {/* breadcrumbs */}
      <nav style={{ margin: "8px 0", fontSize: 14 }}>
        <a href="/">Home</a> &nbsp; / &nbsp;
        <a href="/navatar">Navatar</a> &nbsp; / &nbsp;
        <strong>Describe &amp; Generate</strong>
      </nav>

      <h1>Describe &amp; Generate</h1>

      <form onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <textarea
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, storybook style')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          style={{ width: "100%", minHeight: 120, marginBottom: 16 }}
        />

        {/* visible now; editing/masking coming next release */}
        <label style={{ display: "block", marginBottom: 8 }}>
          Source Image (optional)
          <input type="file" accept="image/*" disabled style={{ display: "block", marginTop: 4 }} />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          Mask Image (optional, transparent areas → replaced)
          <input type="file" accept="image/*" disabled style={{ display: "block", marginTop: 4 }} />
        </label>

        <input
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 16, height: 40, padding: "0 10px" }}
        />

        <button type="submit" disabled={loading} style={{ height: 44, minWidth: 160 }}>
          {loading ? "Creating..." : "Save"}
        </button>

        {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}
        {ok && <p style={{ color: "seagreen", marginTop: 12 }}>{ok}</p>}

        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.75 }}>
          Tips: Keep faces centered, ask for full-body vs portrait, and mention
          “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </form>
    </div>
  );
}
