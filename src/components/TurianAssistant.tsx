import React, {useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {createClient} from "@supabase/supabase-js";

// --- tiny router helpers (no react-router dependency needed) ---
const goTo = (path: string) => {
  if (location.pathname === path) {
    return true; // already here
  }
  location.assign(path);
  return false;
};
const scrollToAnchor = (key: string) => {
  // Try [data-turian="<key>"] then id="<key>"
  const el = document.querySelector<HTMLElement>(`[data-turian="${key}"]`) ??
             document.getElementById(key);
  if (el) {
    el.scrollIntoView({behavior: "smooth", block: "start"});
    return true;
  }
  return false;
};

// Map common nouns to routes/anchors
const NAV_MAP: Record<string, {path?: string; anchor?: string}> = {
  languages: {path: "/naturversity/languages", anchor: "languages"},
  learn:     {path: "/naturversity", anchor: "learn"},
  courses:   {path: "/naturversity/courses", anchor: "courses"},
  worlds:    {path: "/worlds", anchor: "worlds"},
  zones:     {path: "/zones", anchor: "zones"},
  marketplace: {path: "/marketplace", anchor: "shop"},
  shop: {path: "/marketplace", anchor: "shop"},
  cart: {path: "/cart", anchor: "cart"},
  profile: {path: "/profile", anchor: "profile"},
};

type ChatMsg = {role: "user" | "assistant" | "system"; content: string};
type Action =
  | {type: "navigate"; path: string}
  | {type: "scroll"; anchor: string}
  | {type: "none"};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// route/DOM context we send to the model
const buildRouteContext = () => {
  const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-turian]"))
    .map((el) => el.getAttribute("data-turian"))
    .filter(Boolean) as string[];
  return {
    path: location.pathname,
    title: document.title,
    anchors: Array.from(new Set(anchors)), // unique list of available sections
  };
};

// parse an action JSON fenced block from model, e.g. ```action{"type":"scroll","anchor":"cart"}```
const extractAction = (text: string): Action => {
  const m = text.match(/```action\s*([\s\S]*?)```/i);
  if (!m) return {type: "none"};
  try {
    const obj = JSON.parse(m[1].trim());
    if (obj?.type === "navigate" && typeof obj.path === "string") {
      return {type: "navigate", path: obj.path};
    }
    if (obj?.type === "scroll" && typeof obj.anchor === "string") {
      return {type: "scroll", anchor: obj.anchor};
    }
  } catch {}
  return {type: "none"};
};

// quick local intent for “where is …”
const quickIntent = (q: string): Action => {
  const norm = q.toLowerCase().replace(/[?.!]/g, "").trim();
  const m = norm.match(/(?:where\s+is|open|go\s+to)\s+(.+)$/);
  if (!m) return {type: "none"};
  const key = m[1].trim();
  const target = NAV_MAP[key] || NAV_MAP[key.replace(/\s+/g, "")];
  if (!target) return {type: "none"};
  if (target.path && location.pathname !== target.path) {
    return {type: "navigate", path: target.path};
  }
  if (target.anchor) return {type: "scroll", anchor: target.anchor};
  return {type: "none"};
};

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<null | object>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {role: "assistant", content: 'Try: "Where is languages?"'}
  ]);
  const drawerRef = useRef<HTMLDivElement>(null);

  // auth state
  useEffect(() => {
    supabase.auth.getSession().then(({data}) => setSession(data.session ?? null));
    const {data: sub} = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  // keep body scroll normal (no zoom trap)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overscrollBehaviorY;
    document.body.style.overscrollBehaviorY = "contain";
    return () => { document.body.style.overscrollBehaviorY = prev; };
  }, [open]);

  // anchor to <body> so layout transforms never clip it
  const portalTarget = useMemo(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    return div;
  }, []);
  useEffect(() => () => { portalTarget.remove(); }, [portalTarget]);

  const post = async () => {
    const text = input.trim();
    if (!text) return;

    // Always render the user bubble
    setMsgs((m) => [...m, {role: "user", content: text}]);
    setInput("");

    // Quick local intent (navigate/scroll) for “where is …”
    const qi = quickIntent(text);
    if (qi.type === "navigate") {
      const willScrollHere = goTo(qi.path);
      // if we just navigated away, stop here—fresh page load will handle anchor if user repeats
      if (!willScrollHere) return;
    }
    if (qi.type === "scroll") {
      scrollToAnchor(qi.anchor);
    }

    // If not authed, nudge only
    if (!session) {
      setMsgs((m) => [
        ...m,
        {role: "assistant", content: "Please create an account or continue with Google to get started!"}
      ]);
      return;
    }

    // Build route context for the model
    const ctx = buildRouteContext();

    try {
      const r = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({messages: [...msgs, {role: "user", content: text}], route: ctx}),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json() as {reply: string};
      const reply = data.reply ?? "";
      setMsgs((m) => [...m, {role: "assistant", content: reply}]);

      // If the model returned an action block, perform it
      const act = extractAction(reply);
      if (act.type === "navigate") {
        const here = goTo(act.path);
        if (!here) return;
      }
      if (act.type === "scroll") {
        scrollToAnchor(act.anchor);
      }
    } catch (err) {
      setMsgs((m) => [...m, {role: "assistant", content: "Hmm, I couldn’t reach chat right now. Try again."}]);
      console.error(err);
    }
  };

  // UI
  const button =
    <button
      aria-label="Open Turian assistant"
      onClick={() => setOpen(true)}
      style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 2147483000,
        width: 64, height: 64, borderRadius: 18, border: "none",
        background: "var(--brand-blue, #2f6cff)", boxShadow: "0 6px 18px rgba(0,0,0,.18)",
        padding: 0, cursor: "pointer"
      }}>
      <img src="/favicon-64x64.png" alt="" width={40} height={40} style={{borderRadius: 12, background: "#fff"}} />
    </button>;

  const drawer = (
    <div
      role="dialog" aria-label="Ask Turian"
      ref={drawerRef}
      style={{
        position: "fixed", right: 12, bottom: 12, zIndex: 2147483646,
        width: "min(92vw, 560px)",
        maxHeight: "70vh",
        display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,.22)",
      }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", borderTopLeftRadius: 16, borderTopRightRadius: 16,
        background: "var(--brand-blue, #2f6cff)", color: "#fff"
      }}>
        <img src="/favicon-64x64.png" alt="" width={22} height={22} style={{borderRadius: 6, background: "#fff"}}/>
        <strong>Ask Turian</strong>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{marginLeft: "auto", width: 28, height: 28, borderRadius: 8, border: "none", background: "rgba(255,255,255,.25)", color: "#fff"}}>
          ×
        </button>
      </div>

      <div style={{padding: 12, overflow: "auto"}}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", margin: "8px 0"
          }}>
            <div style={{
              maxWidth: "85%", padding: "10px 12px", borderRadius: 12,
              background: m.role === "user" ? "var(--brand-blue, #2f6cff)" : "#f2f4ff",
              color: m.role === "user" ? "#fff" : "#111"
            }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee"}}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? post() : undefined)}
          placeholder="Ask Turian…"
          style={{flex: 1, padding: "12px 12px", borderRadius: 10, border: "1px solid #d9ddee", outline: "none"}}
        />
        <button onClick={post} style={{
          padding: "0 16px", borderRadius: 10, border: "none",
          background: "var(--brand-blue, #2f6cff)", color: "#fff", height: 44
        }}>
          Send
        </button>
      </div>
    </div>
  );

  return createPortal(
    <>
      {!open && button}
      {open && drawer}
    </>,
    portalTarget
  );
}
