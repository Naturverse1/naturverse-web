type Role = "user" | "assistant" | "system";
export type ChatMsg = { role: Role; content: string };

// Very small "zone aware" demo brain
function zoneAwareReply(input: string, path: string): string {
  const q = input.toLowerCase();
  if (q.includes("course") || q.includes("naturversity") || path.includes("/naturversity")) {
    return "Naturversity courses live under **Naturversity** → pick a sub-hub (Languages, Music, Wellness, Art).";
  }
  if (q.includes("language")) return "Languages are inside Naturversity → Languages.";
  if (q.includes("market") || path.includes("/marketplace")) {
    return "Marketplace has Shop, NFT/Mint, and Specials. Wishlist is coming soon.";
  }
  if (q.includes("navatar") || path.includes("/navatar")) {
    return "Navatar hub has: Home, Create (generate / upload / camera), and Pick (from our gallery).";
  }
  return "I’m Turian 👋 — ask me about Worlds, Zones, Naturversity, Marketplace, or Navatars.";
}

const handler = async (event: any) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse input
    const body = event.body ? JSON.parse(event.body) : {};
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMsg[]) : [];
    const path = typeof body?.path === "string" ? body.path : "/";

    const last = messages[messages.length - 1];
    const userText = last?.content?.toString() ?? "";

    // Optional: proxy to local model if OLLAMA_URL is set, otherwise canned reply
    const ollamaUrl = process.env.OLLAMA_URL; // e.g. http://127.0.0.1:11434
    let reply: string;

    if (ollamaUrl) {
      try {
        // Minimalistic prompt; keep simple for demo
        const res = await fetch(`${ollamaUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3.1",
            prompt: `You are Turian, a helpful assistant for thenaturverse.com. Current path: ${path}
User: ${userText}
Assistant:`,
            stream: false,
          }),
        });

        const data = (await res.json()) as { response?: string };
        reply = data?.response?.trim() || zoneAwareReply(userText, path);
      } catch {
        reply = zoneAwareReply(userText, path);
      }
    } else {
      reply = zoneAwareReply(userText, path);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          { role: "assistant", content: reply } as ChatMsg,
        ],
      }),
    };
  } catch (err) {
    return {
      statusCode: 200, // keep UI happy; return a graceful message
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        messages: [{ role: "assistant", content: "Oops — I hit a snag. Try again in a moment." } as ChatMsg],
      }),
    };
  }
};

export { handler };
