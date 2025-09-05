/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import "./turian-assistant.css";

type UiMsg = { role: "user" | "assistant" | "system"; content: string };

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// simple, router-agnostic map (add/change paths to fit your site)
const ROUTE_ALIASES: Record<string, string> = {
  home: "/",
  languages: "/languages",
  language: "/languages",
  course: "/languages",
  courses: "/languages",
  learn: "/learn",
  play: "/play",
  worlds: "/worlds",
  zones: "/zones",
  marketplace: "/marketplace",
  market: "/marketplace",
  shop: "/shop",
  cart: "/cart",
  profile: "/profile",
};

function tryNavigateFromMessage(text: string) {
  // “where is …”, “where are …”, “go to …”, “open …”
  const m =
    text.match(/^\s*(where\s+(is|are)\s+|go\s+to\s+|open\s+)(the\s+)?(.+?)\s*$/i) ||
    text.match(/^\s*(languages|worlds|zones|courses|shop|cart|home)\s*$/i);
  if (!m) return false;

  const key = (m[4] ?? m[1] ?? text).toLowerCase().trim();
  // normalize simple plurals/spacing
  const norm = key.replace(/[^a-z0-9 ]+/g, "").replace(/\s+/g, " ");
  const target =
    ROUTE_ALIASES[norm] ||
    ROUTE_ALIASES[norm.replace(/s$/, "")] ||
    ROUTE_ALIASES[norm.split(" ")[0]];
  if (!target) return false;

  // navigate without depending on a specific router
  window.location.assign(target);
  return true;
}

export default function TurianAssistant() {
  // Auth-gated: show only when logged in
  const [session, setSession] = useState<boolean>(false);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => mounted && setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!session) return null;

  return createPortal(<AssistantUi />, document.body);
}

function AssistantUi() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMsg[]>([
    { role: "system", content: 'Try: "Where is languages?"' },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // auto-scroll to latest
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    // local echo
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    // “Where is …” -> navigate immediately
    if (tryNavigateFromMessage(text)) {
      setOpen(false);
      return;
    }

    // otherwise call your Netlify function
    setSending(true);
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      const reply: string =
        data?.reply ?? "Sorry — I couldn't find that yet, try asking about languages, worlds, zones, or shop.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network hiccup — please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating action button */}
      <button
        className="turian-fab"
        aria-label="Ask Turian"
        onClick={() => setOpen(true)}
      >
        <img
          src="/favicon-64x64.png" // use your round favicon (public/favicon-64x64.png)
          alt="Turian"
          className="turian-fab__img"
          draggable={false}
        />
      </button>

      {/* Drawer / dialog */}
      {open && (
        <div className="turian-dialog" role="dialog" aria-label="Ask Turian">
          <div className="turian-dialog__header">
            <div className="turian-dialog__title">
              <img src="/favicon-32x32.png" alt="" />
              <span>Ask Turian</span>
            </div>
            <button className="turian-dialog__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>

          <div ref={listRef} className="turian-dialog__messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg msg--${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>

          <form
            className="turian-dialog__input"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Turian…"
              // iOS zoom fix — keep at least 16px
              inputMode="text"
              autoComplete="off"
            />
            <button disabled={!canSend} type="submit">
              {sending ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

