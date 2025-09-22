import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl, getBearer, retryingFetch } from "../../src/lib/_hf";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const base = getSpaceBaseUrl();
  if (!base) {
    return { statusCode: 500, body: JSON.stringify({ error: "HF_SPACE_URL not set" }) };
  }

  const eventId = event.queryStringParameters?.eventId;
  if (!eventId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing eventId" }) };
  }

  const url = `${base}/gradio_api/call/infer/${encodeURIComponent(eventId)}`;
  const token = getBearer();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await retryingFetch(url, { headers });
    if (res.status === 202) {
      // Not ready yet
      return { statusCode: 200, body: JSON.stringify({ status: "pending" }) };
    }

    const json = await res.json();

    // Gradio returns { data: [ imageDict, seedNumber ] }
    // imageDict may have { url } or { path }.
    const imageDict = json?.data?.[0];
    const seed = json?.data?.[1];

    if (!imageDict) {
      return { statusCode: 502, body: JSON.stringify({ error: "No image in response", raw: json }) };
    }

    let imageUrl: string | undefined = imageDict.url;
    if (!imageUrl && imageDict.path) {
      // Ensure absolute URL if only a path is returned
      const p = String(imageDict.path).replace(/^\/+/, "");
      imageUrl = `${base}/${p.startsWith("file=") ? p : `file=${p}`}`;
    }

    if (!imageUrl) {
      return { statusCode: 502, body: JSON.stringify({ error: "Could not resolve image URL", raw: imageDict }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "done", imageUrl, seed }),
    };
  } catch (err: any) {
    return {
      statusCode: 502,
      body: JSON.stringify({ status: "error", error: String(err) }),
    };
  }
};
