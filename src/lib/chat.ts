export async function askTurian(prompt: string): Promise<string> {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  const { text } = await res.json();
  return text;
}
