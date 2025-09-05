export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

export async function sendChat(messages: ChatMsg[], path: string) {
  const res = await fetch("/.netlify/functions/dev-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages, path }),
  });
  if (!res.ok) throw new Error(`Chat error: ${res.status}`);
  return (await res.json()) as { reply: string };
}
