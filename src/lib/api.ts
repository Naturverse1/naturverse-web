export async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function callFn(
  name: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any,
  params?: Record<string, string | number | boolean>
) {
  const q = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])) : '';
  const res = await fetch(`/.netlify/functions/${name}${q}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json };
}

