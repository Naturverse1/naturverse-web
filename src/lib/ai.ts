export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function chat(messages: ChatMessage[], extra?: { path?: string }) {
  const res = await fetch('/.netlify/functions/dev-chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, path: extra?.path ?? window.location.pathname }),
  });
  if (!res.ok) throw new Error(`chat failed: ${res.status}`);
  const data = (await res.json()) as { reply: string };
  return data.reply;
}
