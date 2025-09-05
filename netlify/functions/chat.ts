import type {Handler} from "@netlify/functions";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const {messages, route} = JSON.parse(event.body || "{}") as {
    messages: {role: "user" | "assistant" | "system"; content: string}[];
    route?: {path: string; title?: string; anchors?: string[]};
  };

  const system = [
    "You are Turian, the Naturverse assistant.",
    "Answer briefly (<= 2 sentences).",
    "You know the current route and available anchors (sections) on the page.",
    "If the user asks where something is (e.g., languages, courses, cart, worlds, zones, marketplace):",
    " - If it exists on this page (anchor present), include a fenced action: ```action{\"type\":\"scroll\",\"anchor\":\"<anchor>\"}```",
    " - If it lives on a different page, include: ```action{\"type\":\"navigate\",\"path\":\"/<path>\"}```",
    "Return at most one action block. Put the human-friendly answer first, action after."
  ].join("\n");

  const userContext = `ROUTE:\n- path: ${route?.path}\n- title: ${route?.title}\n- anchors: ${route?.anchors?.join(", ") || "none"}`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {role: "system", content: system},
      {role: "system", content: userContext},
      ...(messages || [])
    ],
    temperature: 0.2,
  };

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    return {statusCode: 500, body: JSON.stringify({error: `OpenAI ${r.status}`})};
  }
  const data = await r.json();
  const reply: string = data.choices?.[0]?.message?.content ?? "Sorry—no reply.";
  return {statusCode: 200, body: JSON.stringify({reply})};
};
