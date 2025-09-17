import type { Handler } from "@netlify/functions";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-70b-versatile"; // change if you prefer another

const handler: Handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const payload = {
      model: MODEL,
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 512,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    async function callGroq() {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`groq ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim?.();
      if (!content) throw new Error("empty");
      return content;
    }

    let content: string;
    try {
      content = await callGroq();
    } catch {
      // one quick retry
      try { content = await callGroq(); }
      catch {
        // offline persona fallback
        return {
          statusCode: 200,
          body: JSON.stringify({
            content:
              "I’m in offline mode, but I’ve still got plenty of Naturverse wisdom! Ask me about worlds, quests, or how to earn NATUR. 🌿",
            offline: true,
          }),
        };
      }
    } finally {
      clearTimeout(timer);
    }

    return { statusCode: 200, body: JSON.stringify({ content }) };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: "Whoops—my vines got tangled. Try again in a moment.",
        offline: true,
      }),
    };
  }
};

export { handler };
