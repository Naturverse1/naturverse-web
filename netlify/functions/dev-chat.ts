import type { Handler } from '@netlify/functions';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

const OLLAMA_URL = process.env.OLLAMA_URL; // e.g. http://localhost:11434

async function ollamaChat(messages: Msg[]) {
  // Minimal proxy to Ollama's chat API (if available)
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'llama3.1', messages }),
  });
  if (!res.ok) throw new Error('ollama error');
  const json = await res.json();
  const reply: string = json?.message?.content ?? '…';
  return reply;
}

function cannedReply(path: string, lastUser: string) {
  // Simple, zone-aware helper text for demos
  const byZone: Record<string, string> = {
    '/marketplace': `You're in Marketplace. You can browse "Shop", "NFT/Mint", and "Specials". \
Try "What can I buy?"`,
    '/navatar': `You're in Navatar. Use Create (generator), Pick (from library), or Upload (camera). \
Try "Help me make a scooter Navatar!"`,
    '/naturversity': `You're in Naturversity. Ask for languages, courses, or tips. \
Try "Teach me 'hello' in Thai."`,
  };

  const zoneTip =
    Object.entries(byZone).find(([key]) => path.startsWith(key))?.[1] ??
    `You're on The Naturverse. Ask about Worlds, Zones, or getting started.`;

  return `${zoneTip}

You said: "${lastUser}"
Tip: You can ask me to navigate (e.g., "take me to Marketplace Specials") or explain a feature.`;
}

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}') as { messages: Msg[]; path?: string };
    const lastUser = [...(body.messages ?? [])].reverse().find(m => m.role === 'user')?.content ?? '';
    const path = body.path ?? '/';

    // If local + Ollama is configured, use it; otherwise use canned replies.
    if (OLLAMA_URL && (process.env.NETLIFY_LOCAL || process.env.CONTEXT === 'dev')) {
      try {
        const reply = await ollamaChat(body.messages ?? []);
        return Response.json({ reply });
      } catch {
        // fall through to canned
      }
    }
    const reply = cannedReply(path, lastUser);
    return Response.json({ reply });
  } catch (err: any) {
    return Response.json({ reply: `Oops, I hit a snag: ${err?.message ?? err}` }, { status: 200 });
  }
};
