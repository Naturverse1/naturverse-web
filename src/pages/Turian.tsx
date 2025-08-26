import React from "react";
import "./turian.css";

/** Optional: drop-in hook you can wire later */
function useTurianChat() {
  // Wire this to your API route when ready
  async function send(message: string): Promise<string> {
    const res = await fetch("/api/turian-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json().catch(() => ({}));
    return data?.reply ?? "";
  }
  return { send };
}

export default function Turian() {
  // const { send } = useTurianChat(); // keep for later
  return (
    <main className="turian-page" role="main" aria-labelledby="turian-title">
      <nav className="turian-breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>Turian</span>
      </nav>

      <header className="turian-hero">
        <h1 id="turian-title">Turian the Durian</h1>
        <p className="lead">
          Ask for tips, quests, and facts. This is an offline demo—no external
          calls or models yet.
        </p>
      </header>

      {/* Status card (kept), chat fully removed */}
      <section className="turian-card" aria-live="polite">
        <div className="turian-card__title">Chat with Turian</div>
        <p className="turian-card__text">Chat feature temporarily disabled.</p>
      </section>

      <p className="coming-soon">Live chat coming soon.</p>

      {/* ------- When you’re ready, drop a new chat form here -------
      <form className="turian-chat" onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.querySelector("input[name='q']") as HTMLInputElement;
        // const reply = await send(input.value);
        // show reply in your UI
        input.value = "";
      }}>
        <label htmlFor="turian-q" className="sr-only">Ask Turian</label>
        <input id="turian-q" name="q" placeholder="Ask Turian anything…" />
        <button type="submit" className="btn-primary">Ask</button>
      </form>
      ------------------------------------------------------------- */}
    </main>
  );
}

