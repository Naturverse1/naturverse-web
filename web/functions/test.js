export async function onRequest() {
  return new Response(JSON.stringify({ ok: true, route: "/test" }), { headers: { "content-type": "application/json" } });
}
