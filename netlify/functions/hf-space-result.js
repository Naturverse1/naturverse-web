// Poll the Space for a job result. Returns
//  - { status:"pending" } while not ready
//  - { status:"complete", imageUrl } when done
//  - { status:"error", message } for failures
const { endpoints, extractImageUrl } = require("./_hf");

async function tryFetchJson(url) {
  // Many Spaces stream SSE; some return JSON directly. We try JSON first,
  // then (if it's text/event-stream) we parse the SSE quickly for "complete".
  const res = await fetch(url, { method: "GET" });

  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    const json = await res.json();
    return { kind: "json", json };
  }

  // Read text (SSE). We only scan what we got; if no "complete", return pending.
  const text = await res.text();
  return { kind: "sse", text };
}

function parseSSEForComplete(text) {
  // Look for the last "event: complete" block and its succeeding "data: ..."
  // Example lines:
  // event: heartbeat
  // data: null
  //
  // event: complete
  // data: {"path": "...", "url": "..."}
  const parts = text.split(/\r?\n\r?\n/);
  for (let i = parts.length - 1; i >= 0; i--) {
    const block = parts[i];
    if (/^event:\s*complete/m.test(block)) {
      const m = block.match(/^data:\s*(.+)$/m);
      if (m) {
        try {
          return JSON.parse(m[1]);
        } catch (_) {
          /* fall through */
        }
      }
    }
  }
  return null;
}

exports.handler = async (evt) => {
  try {
    const eventId = (evt.queryStringParameters && evt.queryStringParameters.eventId) || "";
    if (!eventId) {
      return { statusCode: 400, body: "Missing ?eventId=" };
    }

    const { resultQuery, resultPath, fileFromTmpPath } = endpoints();

    const urls = [resultQuery(eventId), resultPath(eventId)];
    let lastKind = null,
      lastRaw = null;

    for (const u of urls) {
      const got = await tryFetchJson(u);
      lastKind = got.kind;
      lastRaw = got;

      if (got.kind === "json") {
        // Some Spaces might return a JSON status or direct data
        const j = got.json;
        // If it's already the final payload:
        if (j && (j.data || j.url || j.path)) {
          const payload = j.data ?? j;
          const { imageUrl } = extractImageUrl(payload, fileFromTmpPath);
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "complete", imageUrl }),
          };
        }
      } else {
        const dataObj = parseSSEForComplete(got.text);
        if (dataObj) {
          const { imageUrl } = extractImageUrl(dataObj, fileFromTmpPath);
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "complete", imageUrl }),
          };
        }
      }
    }

    // If we reach here, there's no final result yet
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
};
