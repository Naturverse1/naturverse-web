export async function askMagic(kind: 'story'|'quiz'|'tip', prompt: string) {
  const r = await fetch('/.netlify/functions/magic', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ kind, prompt })
  });
  return r.json();
}
