import { useState } from "react";
import type { ChatReq, ChatRes } from "../types";
import { api } from "../lib/api";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ role: "user"|"assistant"; content: string }[]>([]);

  async function send() {
    if (!input.trim()) return;
    const next = [...log, { role: "user", content: input }];
    setLog(next);
    setInput("");
    const req: ChatReq = { messages: [{ role: "system", content: "You are a friendly Naturverse guide." }, ...next] as any };
    const res = await api<ChatRes>("/.netlify/functions/chat", { method: "POST", body: JSON.stringify(req) });
    setLog((l) => [...l, { role: "assistant", content: res.reply }]);
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <div style={{ minHeight: 80, marginBottom: 8 }}>
        {log.map((m, i) => <p key={i}><strong>{m.role}:</strong> {m.content}</p>)}
      </div>
      <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask Natur…" />
      <button onClick={send}>Send</button>
    </div>
  );
}

