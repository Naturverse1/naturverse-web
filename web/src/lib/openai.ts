export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function askAI(prompt: string) {
  const res = await fetch('/.netlify/functions/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
  });
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const data = await res.json();
  return data.reply as string;
}
