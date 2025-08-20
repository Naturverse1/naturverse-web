import { getDeviceId } from './device';

export async function getBalance(): Promise<number> {
  const r = await fetch('/.netlify/functions/tokens?op=get&device=' + getDeviceId());
  const j = await r.json(); return j.balance ?? 0;
}
export async function addTokens(amount: number) {
  await fetch('/.netlify/functions/tokens', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ op:'add', device: getDeviceId(), amount })
  });
}
