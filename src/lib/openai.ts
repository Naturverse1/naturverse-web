export async function aiComplete(opts: { prompt: string; system?: string }) {
  const res = await fetch("/.netlify/functions/openai-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  if (!res.ok) throw new Error("AI error");
  return res.json() as Promise<{ text: string }>;
}
