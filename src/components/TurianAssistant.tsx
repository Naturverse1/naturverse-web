import { useEffect, useMemo, useRef, useState } from "react";

// Minimal message shape used by the widget
type Msg = { role: "user" | "assistant"; content: string };

// Simple signed-in detector: any Supabase auth cookie present
function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Supabase sets cookies that start with sb- (e.g. sb-access-token)
    const hasSb = document.cookie.split(";").some((c) => c.trim().startsWith("sb-"));
    setLoggedIn(hasSb);
  }, []);
  return loggedIn;
}

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: 'Try: "Where is languages?"' },
  ]);

  const isLoggedIn = useIsLoggedIn();
  const inputRef = useRef<HTMLInputElement>(null);

  // Use Turian head from /public (kept as-is in repo)
  const avatarUrl = "/favicon-64x64.png";

  // simple zone hint using current path
  const zoneHint = useMemo(() => {
    const p = window.location.pathname.toLowerCase();
    if (p.includes("navatar")) return "Navatar";
    if (p.includes("naturbank")) return "NaturBank";
    if (p.includes("market")) return "Marketplace";
    if (p === "/" || p.includes("home")) return "Home";
    return "Site";
  }, []);

  async function sendToBot(history: Msg[]) {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zone: zoneHint,
        messages: history,
      }),
    });
    if (!res.ok) throw new Error("Chat backend error");
    const data = await res.json();
    // Expecting { reply: string }
    return (data?.reply as string) ?? "Hmm, I didn’t catch that.";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next: Msg[] = [...msgs, { role: "user", content: input.trim() }];
    setMsgs(next);
    setInput("");
    setPending(true);

    try {
      // If not logged in, show the friendly sign-up nudge and stop.
      if (!isLoggedIn) {
        setMsgs([
          ...next,
          {
            role: "assistant",
            content:
              "Please create an account or continue with Google to get started!",
          },
        ]);
      } else {
        const reply = await sendToBot(next);
        setMsgs([...next, { role: "assistant", content: reply }]);
      }
    } catch {
      setMsgs([
        ...next,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setPending(false);
      // keep drawer OPEN (as you requested); focus the input for quick follow-ups
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        aria-label="Ask Turian"
        className="turian-fab"
        onClick={() => setOpen(true)}
      >
        <img src={avatarUrl} alt="Turian" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="turian-drawer">
          <div className="turian-header">
            <img src={avatarUrl} alt="" />
            <span>Ask Turian</span>
            <button
              aria-label="Close"
              className="turian-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="turian-body">
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>

          <form className="turian-input" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              placeholder="Ask Turian..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pending}
            />
            <button type="submit" disabled={pending}>
              {pending ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

