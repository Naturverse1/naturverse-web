import React, { useEffect, useMemo, useRef, useState } from "react";
import Page from "../components/Page";
import { Img } from "../components";

type Msg = { id: string; role: "user" | "turian"; text: string; ts: number };

const K = "naturverse.turian.history.v1";

const read = (): Msg[] => {
  try { return JSON.parse(localStorage.getItem(K) || "[]"); } catch { return []; }
};
const write = (v: Msg[]) => { try { localStorage.setItem(K, JSON.stringify(v.slice(-30))); } catch {} };

const SUGGESTIONS: { section: string; items: string[] }[] = [
  { section: "Worlds", items: [
    "Give me a 3-stop itinerary for Thailandia.",
    "Fun facts about penguins in Antarctiland.",
    "Create a scavenger list for Europalia."
  ]},
  { section: "Zones", items: [
    "Pitch a 1-minute karaoke theme for Music.",
    "Daily stretch routine for Wellness (5 mins).",
    "Quest ideas for Creator Lab characters."
  ]},
  { section: "Naturbank", items: [
    "Explain NATUR coin in kid-friendly terms.",
    "How would a wallet work here (high level)?"
  ]},
  { section: "Marketplace", items: [
    "3 merch ideas tied to Kiwilandia.",
    "How to word a wishlist description for a tee?"
  ]},
];

// No dedicated mascot image; fall back to an emoji so the header logo remains unique
const mascotSrc = "";

function cannedReply(q: string): string {
  // Lightweight, offline “assistant” so we don’t add deps or call APIs.
  const lower = q.toLowerCase();
  if (lower.includes("itinerary") || lower.includes("stops")) {
    return "Here’s a playful 3-stop itinerary:\n1) Meet a local guide at the capital gate.\n2) Snack quest at the market (collect 3 regional fruits).\n3) Nature snapshot challenge at a landmark. Earn a stamp + 10 XP.";
  }
  if (lower.includes("stretch") || lower.includes("routine")) {
    return "5-minute wellness flow:\n• Neck circles ×5\n• Shoulder rolls ×10\n• Forward fold 20s\n• Cat-cow ×8\n• Child’s pose 30s\nRemember to breathe in for 4, out for 6.";
  }
  if (lower.includes("natur") || lower.includes("wallet")) {
    return "NATUR (demo): a point-style coin for quests and creations. Wallets will show balance, earnings, and redemptions. Today this is placeholder only; no real transactions yet.";
  }
  if (lower.includes("merch") || lower.includes("wishlist")) {
    return "Wishlist copy tip: “Kiwilandia Tee — kiwis & sheep icons, soft cotton, supports rewilding projects.” Keep it short, fun, and impact-oriented.";
  }
  return "Hi! I’m Turian the Durian. Ask about worlds, zones, quests, or copywriting. Live AI replies arrive later—this message is generated locally.";
}

export default function TurianPage() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<Msg[]>(read());
  const listRef = useRef<HTMLDivElement>(null);

  const ask = (t: string) => {
    if (!t.trim()) return;
    const now = Date.now();
    const user: Msg = { id: "u" + now, role: "user", text: t.trim(), ts: now };
    const reply: Msg = { id: "t" + now, role: "turian", text: cannedReply(t), ts: now + 1 };
    const next = [...history, user, reply];
    setHistory(next);
    write(next);
    setText("");
  };

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); ask(text); };

  useEffect(() => {
    // keep scrolled to bottom on new messages
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [history.length]);

  const hasHistory = history.length > 0;
  const groupedSuggestions = useMemo(() => SUGGESTIONS, []);

  return (
    <>
        <Page title="Turian the Durian" subtitle="Ask for tips, quests, and facts. This is an offline demo—no external calls or models yet." crumbs={[{ href:"/", label:"Home" }, { label:"Turian" }]}>

      <div className="nv-card" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
        {mascotSrc ? (
          <Img src={mascotSrc} alt="Turian the Durian mascot" width={44} height={44} style={{ borderRadius: 8 }} />
        ) : (
          <span role="img" aria-label="durian" style={{ fontSize: 32 }}>🥭</span>
        )}
        <div>
          <strong>Chat with Turian</strong>
          <div className="nv-muted">Coming soon: live help across Worlds, Zones, and Marketplace.</div>
        </div>
      </div>

      {!hasHistory && (
        <div className="turian-suggestions turian-quests">
          {groupedSuggestions.map(group => (
            <div className="turian-card" key={group.section}>
              <div className="turian-card-h">
                <span className="label">{group.section}</span>
              </div>
              <div className="chips">
                {group.items.map((s, i) => (
                  <button key={i} className="chip" onClick={() => ask(s)}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="turian-panel">
        <div className="turian-msgs" ref={listRef} aria-live="polite">
          {history.map(m => (
            <div key={m.id} className={"msg " + m.role}>
              <div className="bubble">
                {m.text.split("\n").map((ln, i) => <p key={i}>{ln}</p>)}
              </div>
            </div>
          ))}
          {!hasHistory && (
            <div className="msg turian">
              <div className="bubble">
                <p>Try a suggestion above or ask something like:</p>
                <p><em>“Give me 3 eco-quests for Madagas­caria.”</em></p>
              </div>
            </div>
          )}
        </div>

        <form className="turian-input" onSubmit={onSubmit}>
          <input
            aria-label="Ask Turian"
            placeholder="Ask Turian anything…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn" type="submit">Ask</button>
          <button
            type="button"
            className="btn outline"
            onClick={() => { setHistory([]); write([]); }}
            title="Clear conversation"
          >
            Clear
          </button>
        </form>
      </div>

      <p className="meta">Coming soon: real AI tutor connected across Worlds, Zones, Marketplace, and Naturbank; context-aware hints; quest generation; and Supabase history.</p>
      </Page>
    </>
  );
}

