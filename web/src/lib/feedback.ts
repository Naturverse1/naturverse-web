export function buildFormPayload(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&');
}

export async function submitNetlifyForm(fields: Record<string, string>) {
  const body = buildFormPayload(fields);
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Request failed');
}
