export type ChatMsg = {
  role: 'user' | 'assistant';
  content: string;
};

export async function sendChat(msgs: ChatMsg[], path: string): Promise<ChatMsg[]> {
  const message = msgs[msgs.length - 1]?.content ?? '';
  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, path }),
    });
    if (!res.ok) return msgs;
    const data = await res.json().catch(() => ({}));
    const reply = typeof data.reply === 'string' ? data.reply : '';
    return reply ? [...msgs, { role: 'assistant', content: reply }] : msgs;
  } catch {
    return msgs;
  }
}
