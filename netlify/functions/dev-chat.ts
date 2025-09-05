import type { Handler } from "@netlify/functions";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}") as { messages?: Msg[]; path?: string };
    const path = body.path || "/";
    const last = body.messages?.slice().reverse().find(m => m.role === "user")?.content || "";

    // Zone-aware canned replies for demos
    const canned = (() => {
      if (path.startsWith("/marketplace")) return "Marketplace is coming soon. We’ll list featured items, NFTs, and seasonal specials here.";
      if (path.startsWith("/naturversity")) return "Naturversity offers lessons in languages, art, music and wellness. What would you like to learn?";
      if (path.startsWith("/navatar")) return "Create, pick, or upload your Navatar. A generator option is coming soon!";
      return "How can I help you explore The Naturverse?";
    })();

    // If you later set OLLAMA_URL in env, this block proxies to a local model
    const OLLAMA = process.env.OLLAMA_URL;
    if (OLLAMA) {
      const res = await fetch(`${OLLAMA}/api/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model: "llama3.1", prompt: `User: ${last}\nAssistant:`, stream: false }),
      });
      const data = await res.json();
      const reply = data?.response || canned;
      return ok({ reply });
    }

    // Default canned reply
    const reply = last ? `${canned}\n\nYou asked: “${last}”` : canned;
    return ok({ reply });
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || "error" }) };
  }
};

function ok(payload: unknown) {
  return { statusCode: 200, body: JSON.stringify(payload) };
}
