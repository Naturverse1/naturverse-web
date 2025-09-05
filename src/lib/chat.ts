export type ChatMsg = { role: 'user'|'assistant'|'system'; content: string };

export async function sendChat(messages: ChatMsg[], zone?: string): Promise<string> {
  // Prefer the redirect alias if present; else hit the function directly.
  const endpoints = ['/api/chat', '/.netlify/functions/chat'];

  let lastError: any;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages, zone }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok && data?.reply) return data.reply as string;
      lastError = data?.error || 'Assistant failed';
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error(typeof lastError === 'string' ? lastError : 'Network error');
}
