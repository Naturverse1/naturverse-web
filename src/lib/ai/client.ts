export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function askTurian(messages: ChatMessage[]): Promise<string> {
  const res = await fetch('/.netlify/functions/turian-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `AI error ${res.status}`);
  }

  const data = (await res.json()) as { reply?: unknown; text?: unknown };
  const reply =
    (typeof data.reply === 'string' && data.reply.trim()) ||
    (typeof data.text === 'string' && data.text.trim());

  if (!reply) {
    throw new Error('Empty AI response');
  }

  return reply;
}
