export type Role = "user" | "assistant" | "system";
export type ChatMsg = { role: Role; content: string };

export async function sendChat(messages: ChatMsg[], path: string): Promise<ChatMsg[]> {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, path }),
  });
  // If Netlify had a hiccup, still try to parse
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = { messages: [{ role: "assistant", content: "Temporary network glitch — please retry." }] };
  }
  return Array.isArray(data?.messages) ? (data.messages as ChatMsg[]) : [];
}
