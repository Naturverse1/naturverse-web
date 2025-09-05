export async function sendTurianMessage(message: string): Promise<string> {
  const res = await fetch('/api/turian-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.reply ?? '';
}
