// Netlify Function: server-side OpenAI + Supabase write
// No external deps; uses fetch + Supabase REST.
// Env needed (Netlify > Env vars): OPENAI_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import type { Handler } from "@netlify/functions";

const OAI_URL = "https://api.openai.com/v1/chat/completions";

function r(status: number, body = "", headers: Record<string, string> = {}) {
  return { statusCode: status, body, headers: { "Content-Type": "text/plain", ...headers } };
}

export const handler: Handler = async (event) => {
  try {
    const form = event.isBase64Encoded
      ? new URLSearchParams(Buffer.from(event.body || "", "base64").toString())
      : new URLSearchParams(event.body || "");

    const type = (form.get("type") || "tip").toLowerCase();

    // Build prompt
    let userPrompt = "";
    if (type === "tip") {
      userPrompt = "Write a concise creative-learning tip for kids called 'Turian Tip': one short title line, then one or two short sentences.";
    } else if (type === "story") {
      userPrompt = "Create a 2-sentence seed for an eco-adventure children's story. Return just the seed text.";
    } else if (type === "quiz") {
      userPrompt = "Create one fun, kid-friendly multiple-choice nature question (A-D) and mark the correct answer letter at the end as 'Answer: X'.";
    } else {
      return r(400, "Unknown type");
    }

    // OpenAI
    const oaiRes = await fetch(OAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7,
      }),
    });

    if (!oaiRes.ok) {
      const txt = await oaiRes.text();
      return r(502, `OpenAI error: ${txt}`);
    }
    const oai = await oaiRes.json();
    const content: string = oai?.choices?.[0]?.message?.content ?? "Stay curious.";

    // Parse title/body for tip (first line title, rest body)
    let title = "Turian Tip";
    let body = content.trim();
    if (type === "tip") {
      const [first, ...rest] = content.split("\n").filter(Boolean);
      title = (first || "Turian Tip").trim();
      body = rest.join("\n").trim() || content.trim();
    }

    // Write to Supabase via REST (service role)
    const supaUrl = process.env.VITE_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const table =
      type === "tip" ? "tips" :
      type === "story" ? "tips" : // drop into tips for now
      "tips"; // quiz seeds also land here for v1

    const insert = type === "tip"
      ? { title, body }
      : { title: type === "story" ? "Story Seed" : "Quiz Idea", body: content };

    const sbRes = await fetch(`${supaUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "apikey": svc,
        "Authorization": `Bearer ${svc}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(insert),
    });

    if (!sbRes.ok) {
      const t = await sbRes.text();
      return r(502, `Supabase insert error: ${t}`);
    }

    // Redirect back to tips page
    return r(302, "", { Location: "/turian-tips" });
  } catch (e: any) {
    return r(500, `Error: ${e?.message || e}`);
  }
};

