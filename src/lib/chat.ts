export async function askTurian(prompt: string, system?: string) {
  const r = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system }),
  });
  if (!r.ok) throw new Error(await r.text());
  const data = (await r.json()) as { text: string };
  return data.text;
}
