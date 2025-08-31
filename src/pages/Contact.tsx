import React from "react";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k] ?? ""))
    .join("&");
}

export default function Contact() {
  const [state, setState] = React.useState<{ sending?: boolean; error?: string | null }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ sending: true, error: null });

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Netlify needs the "form-name" field to match the hidden static form
    formData.set("form-name", "contact");

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(Object.fromEntries(formData as any)),
      });
      // On success, route to success page
      window.location.assign("/contact/success");
    } catch (err: any) {
      setState({ sending: false, error: err?.message || "Failed to send. Please try again." });
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 20px" }}>
      <h1>Contact</h1>
      <p>Have a question or idea for Naturverse? Send us a message.</p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        action="/contact/success"
        onSubmit={handleSubmit}
        style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 640 }}
      >
        {/* Honeypot field for bots */}
        <input type="hidden" name="form-name" value="contact" />
        <div style={{ display: "none" }}>
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Name</span>
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            autoComplete="name"
            style={input}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            style={input}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Message</span>
          <textarea
            name="message"
            required
            placeholder="How can we help?"
            rows={6}
            style={textarea}
          />
        </label>

        {state.error && (
          <p role="alert" style={{ color: "#b00020", margin: 0 }}>
            {state.error}
          </p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={state.sending} style={btnPrimary}>
            {state.sending ? "Sending…" : "Send message"}
          </button>
          <button type="reset" disabled={state.sending} style={btnGhost}>
            Reset
          </button>
        </div>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          By submitting, you agree to our <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>
    </main>
  );
}

const input: React.CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  padding: "10px 12px",
  font: "16px system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial",
};

const textarea = { ...input, resize: "vertical" } as React.CSSProperties;

const btnPrimary: React.CSSProperties = {
  appearance: "none",
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#1e63ff",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  ...btnPrimary,
  background: "transparent",
  color: "#1e63ff",
  border: "2px solid #1e63ff",
};

