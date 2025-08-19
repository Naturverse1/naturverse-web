type ChatRequest = { system?: string; user: string };

export async function generateTip(prompt: ChatRequest['user']) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write short, upbeat eco-wellness tips for The Naturverse.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 140
    })
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? 'Stay curious 🌱';
}
