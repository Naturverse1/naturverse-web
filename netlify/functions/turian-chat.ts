import type { Handler } from "@netlify/functions";

const SYSTEM_PROMPT = `You are Turian the Durian: a friendly, pun-loving forest guide in The Naturverse.
Keep replies brief (2–6 sentences). Offer tips, quests, and fun facts about nature, creatures, and NATUR coins.
Avoid promises about real purchases or on-chain actions; this environment is a demo.`;

function offlineReply(user: string): string {
  const lines = [
    "🍃 Hey there! I'm Turian the Durian. What’s sprouting in your mind today?",
    "Fun seed: mangroves can survive salty water—salty like my jokes. 😄",
    "Quest idea: snap a photo of three different leaves and name their shapes.",
    "If you're curious about NATUR, try earning by helping a friend—kindness compounds!"
  ];
  const tip = lines[Math.floor(Math.random() * lines.length)];
  const echo = user ? `You said: “${user}”. Here’s a thought…` : "Here’s a thought…";
  return `${echo}\n${tip}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { messages } = JSON.parse(event.body || "{}") as {
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  };

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    const lastUser = [...(messages || [])].reverse().find((m) => m.role === "user")?.content || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: offlineReply(lastUser) })
    };
  }

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(messages || []).slice(-20)
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: offlineReply(""), error: text })
      };
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? offlineReply("");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error: any) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: offlineReply(""), error: String(error?.message || error) })
    };
  }
};
