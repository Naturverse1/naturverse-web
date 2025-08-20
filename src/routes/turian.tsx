import React, { useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import SectionHero from "../components/common/SectionHero";

type Msg = { role: "user" | "guide"; text: string };

export default function TurianGuide() {
  const [log, setLog] = useState<Msg[]>([
    { role: "guide", text: "Sawasdee! I’m Turian the Durian. Where shall we journey today?" }
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    const next: Msg[] = [...log, { role: "user", text }];
    // placeholder reply
    next.push({ role: "guide", text: "Yum! Great idea. I’ll add that to your quest log. 🍃" });
    setLog(next);
    setText("");
  }

  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Turian" }]} />
      <SectionHero title="Turian the AI Guide" subtitle="Ask for tips, quests, and help." emoji="🦔" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", height: 420, overflowY: "auto" }}>
          {log.map((m, i) => (
            <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
              <div style={{
                display: "inline-block",
                background: m.role === "user" ? "#dbeafe" : "#dcfce7",
                padding: "8px 10px",
                borderRadius: 10,
                maxWidth: "70%"
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} placeholder="Ask Turian..." />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
}
