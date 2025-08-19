import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Feedback() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("feedback").insert({ user_id: user?.id ?? null, message: text });
      setText("");
      alert("Thanks for the feedback!");
    } finally {
      setSending(false);
    }
  }

  return (
    <section>
      <h2>💬 Feedback</h2>
      <form onSubmit={submit}>
        <textarea value={text} onChange={e => setText(e.target.value)} required rows={4} style={{ width: "100%", maxWidth: 520 }} />
        <div style={{ marginTop: 8 }}>
          <button disabled={sending}>{sending ? "Sending..." : "Send"}</button>
        </div>
      </form>
    </section>
  );
}
