// Netlify Function (TypeScript, ESM). No @netlify/functions types needed.
export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "OPENAI_API_KEY not set" };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    const input = prompt || "Say hello to Naturverse kiddos in one friendly sentence.";

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input,
        max_output_tokens: 200
      })
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return { statusCode: resp.status, body: errTxt };
    }

    const data = await resp.json();
    const text =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      "Hi from Naturverse!";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};
