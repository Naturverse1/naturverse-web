import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  try {
    const SPACE = process.env.HUGGINGFACE_SPACE_URL;
    if (!SPACE) {
      return { statusCode: 400, body: JSON.stringify({ error: "HUGGINGFACE_SPACE_URL not set" }) };
    }

    const id = event.queryStringParameters?.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };
    }

    const res = await fetch(`${SPACE}/gradio_api/call/infer/${encodeURIComponent(id)}`);

    if (res.status === 204) {
      return { statusCode: 200, body: JSON.stringify({ status: "PENDING" }) };
    }

    const ct = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());

    if (ct.startsWith("image/")) {
      const base64 = `data:${ct};base64,${buf.toString("base64")}`;
      return {
        statusCode: 200,
        headers: { "Cache-Control": "no-store" },
        body: JSON.stringify({ status: "DONE", image: base64 }),
      };
    }

    const text = buf.toString("utf8");
    try {
      const data = JSON.parse(text);
      const fromData = data?.data?.find?.(
        (item: any) => typeof item?.data === "string" && item.data.startsWith("data:image/")
      );
      if (fromData) {
        return { statusCode: 200, body: JSON.stringify({ status: "DONE", image: fromData.data }) };
      }
      if (data?.status && data.status !== "COMPLETE") {
        return { statusCode: 200, body: JSON.stringify({ status: "PENDING" }) };
      }
      return { statusCode: 502, body: JSON.stringify({ error: "Unknown Space response", raw: data }) };
    } catch {
      return { statusCode: 200, body: JSON.stringify({ status: "PENDING" }) };
    }
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || "result failed" }) };
  }
};

export { handler };
