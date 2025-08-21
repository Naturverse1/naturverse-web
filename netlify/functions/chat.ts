// minimal ESM handler (no SDK) – uses OPENAI_API_KEY env
export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { message } = await req.json();
    const body = {
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "You are Turian, a friendly kid-safe nature guide. Keep replies <=80 words." },
        { role: "user", content: String(message ?? "") }
      ]
    };
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    const reply = j.output_text ?? "Hello from Turian!";
    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
  } catch (e:any) {
    return new Response(JSON.stringify({ reply:"Turian is resting. Try again soon." }), { headers: { "Content-Type":"application/json" }, status: 200 });
  }
}
