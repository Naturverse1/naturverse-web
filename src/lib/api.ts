export async function api(path: string, body?: any, init?: RequestInit){
  const res = await fetch(`/.netlify/functions/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", ...(init?.headers||{}) },
    body: body ? JSON.stringify(body) : undefined,
    ...init
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
