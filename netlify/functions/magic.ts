import type { Handler } from '@netlify/functions';

const OPENAI = process.env.OPENAI_API_KEY!;

async function chat(messages:any[]){
  const r = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+OPENAI},
    body: JSON.stringify({ model:'gpt-4o-mini', messages })
  });
  return r.json();
}

export const handler: Handler = async (e) => {
  if(e.httpMethod!=='POST') return { statusCode:405, body:'method' };
  const { kind, prompt } = JSON.parse(e.body||'{}');
  const sys = kind==='quiz'
    ? 'You generate short JSON quizzes with fields: q, choices[4], answer (index). Return ONLY JSON array.'
    : kind==='tip'
      ? 'Return a single sentence kid-friendly wellness tip.'
      : 'Write a 120-200 word uplifting kids story about nature.';
  const out = await chat([{role:'system', content: sys},{role:'user', content: prompt||'Naturverse prompt'}]);
  return { statusCode:200, body: JSON.stringify(out) };
};
