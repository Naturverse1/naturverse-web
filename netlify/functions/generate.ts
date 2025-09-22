import { Handler } from "@netlify/functions";
import { generateImage } from "./hfClient";

const handler: Handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    const result = await generateImage(prompt);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err: any) {
    console.error("HF error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export { handler };
