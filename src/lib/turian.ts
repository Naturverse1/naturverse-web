import { isDemo } from "@/config/ai";

// --- Demo script ----
type Msg = { role: "user" | "assistant" | "system"; content: string };

const TURlAN_PERSONA =
  "I am Turian the Durian — friendly guide of The Naturverse. I keep answers short, helpful, and fun.";

const demoKB: Record<string, string> = {
  hello: "Hey there! I’m Turian. Ask me about Worlds, Zones, or how to make a Navatar.",
  worlds: "Worlds are big realms. Tap a world to explore its Zones and quests!",
  zones: "Zones are sub-areas inside a World. Think markets, temples, or beaches.",
  navatar:
    "Navatar is your avatar. Generate one on the Navatar page — try storybook or character-sheet vibes!",
  naturversity:
    "Naturversity is our learning hub. Lessons, challenges, and badges are coming soon.",
  passport:
    "Your Passport tracks progress and collectibles. It’ll hold your stamps and titles.",
};

function pickDemoReply(text: string): string {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(demoKB)) {
    if (t.includes(k)) return v;
  }
  // default
  return "Got it! (Demo mode) — I’m not calling any AI right now. Try asking about Worlds, Zones, or Navatar.";
}

export async function turianReply(messages: Msg[]): Promise<Msg> {
  if (isDemo) {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    const answer = pickDemoReply(lastUser?.content || "");
    return { role: "assistant", content: answer };
  }

  // LIVE MODE (kept here for later; page won’t call it while demo flag is on)
  const res = await fetch("/.netlify/functions/turian-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { content: string };
  return { role: "assistant", content: data.content };
}

