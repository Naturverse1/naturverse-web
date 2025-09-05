// Minimal chat function with CORS + zone-aware canned replies
export default async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: cors(),
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors() });
  }

  try {
    const { messages, zone } = await req.json();

    const last = Array.isArray(messages) ? messages[messages.length - 1] : null;
    const text = typeof last?.content === "string" ? last.content.trim().toLowerCase() : "";

    // Simple demo router — swap with your model call when ready.
    const reply = route(text, zone ?? "home");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...cors(), "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(`Bad request: ${e?.message ?? e}`, { status: 400, headers: cors() });
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function route(text: string, zone: string) {
  // a couple of friendly answers so investors see it working
  const base =
    zone === "naturversity"
      ? "Naturversity"
      : zone === "marketplace"
      ? "Marketplace"
      : zone === "navatar"
      ? "Navatar"
      : zone === "zones"
      ? "Zones"
      : zone === "worlds"
      ? "Worlds"
      : "Home";

  if (/language|languages/.test(text)) return `Languages live in ${base} → Naturversity → Languages.`;
  if (/course|courses|class|classes/.test(text))
    return `Courses are in ${base} → Naturversity → Courses (coming soon).`;
  if (/shop|buy|store|cart/.test(text)) return `Shop is in Marketplace → Shop.`;
  return `You're in ${base}. Ask me about "languages", "courses", or "shop".`;
}

