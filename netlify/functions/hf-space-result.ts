import type { Handler } from "@netlify/functions";

const SPACE = process.env.HUGGINGFACE_SPACE_URL ?? process.env.HF_SPACE_URL;

export const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;

  if (!id) {
    return resp(400, { errors: ["Missing id"] });
  }

  if (!SPACE) {
    return resp(500, { errors: ["HUGGINGFACE_SPACE_URL not set"] });
  }

  try {
    const res = await fetch(`${SPACE}/gradio_api/call/infer/${encodeURIComponent(id)}`);
    const text = await res.text();
    const body = transformBody(text);

    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body,
    };
  } catch (err: any) {
    return resp(500, { errors: ["Result fetch failed"], detail: String(err?.message || err) });
  }
};

function transformBody(text: string) {
  if (!text) {
    return text;
  }

  try {
    const json = JSON.parse(text);

    if (Array.isArray(json?.data)) {
      const spaceBase = SPACE?.replace(/\/$/, "");
      json.data = json.data.map((item: any) => {
        if (!item || typeof item !== "object") {
          return item;
        }

        if (typeof item.url === "string") {
          return item;
        }

        if (item.image && typeof item.image.url === "string") {
          return item;
        }

        if (spaceBase && typeof item.name === "string") {
          const cleaned = item.name.replace(/^file=*/, "");
          const url = `${spaceBase}/${cleaned}`;
          return { ...item, url };
        }

        return item;
      });
    }

    return JSON.stringify(json);
  } catch {
    return text;
  }
}

function resp(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export default handler;
