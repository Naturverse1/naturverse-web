export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export async function sendChat(history: ChatMsg[], zone: string): Promise<string> {
  const res = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zone, messages: history }),
  });
  if (!res.ok) throw new Error('chat failed');
  const data = await res.json();
  return String(data.reply ?? '');
}
