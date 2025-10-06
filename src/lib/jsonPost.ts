export async function jsonPost<T>(url: string, payload: any): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await r.text();
  try { return JSON.parse(text) as T; }
  catch { throw new Error("non_json_response:" + text.slice(0, 140)); }
}
