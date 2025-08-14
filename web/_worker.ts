export default {
  async fetch(request, env, ctx) {
    const p = new URL(request.url).pathname;
    if (p.startsWith("/hello-world")) {
      return new Response("Hello World from Cloudflare Worker!");
    }
    if (p.startsWith("/health")) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    }
    if (p.startsWith("/user")) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    if (p.startsWith("/observations")) {
      return new Response(JSON.stringify({ items: [] }), {
        headers: { "content-type": "application/json" },
      });
    }
    if (p.startsWith("/auth") || p.startsWith("/logout")) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    }
    return env.ASSETS.fetch(request);
  }
};
