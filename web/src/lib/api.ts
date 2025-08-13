export async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let error = await res.text();
    try {
      error = JSON.parse(error);
    } catch {}
    throw error;
  }
  return res.json();
}
