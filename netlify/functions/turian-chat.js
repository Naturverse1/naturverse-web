export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      return { statusCode: 500, body: "Missing GROQ_API_KEY" };
    }

    const { message, history } = JSON.parse(event.body || "{}");
    if (!message || typeof message !== "string") {
      return { statusCode: 400, body: "Missing 'message' string" };
    }

    const msgs = [
      {
        role: "system",
        content:
          "You are Turian the Durian, a playful guide of the Naturverse. Be friendly, curious, and funny; keep answers concise (2–6 sentences). Use the catchphrase 'Dee mak!' sometimes. No external links. Family-friendly.",
      },
      ...(Array.isArray(history) ? history : []).slice(-6),
      { role: "user", content: message },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: msgs,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Groq error", res.status, text);
      return { statusCode: 502, body: "Upstream error" };
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      "Hmm… I’m a little stumped. Dee mak!";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
}
