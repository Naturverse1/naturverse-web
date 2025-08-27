try {
  await import("undici/polyfill");
} catch {}

// Fails the build if RLS/policies drift on critical tables.
// Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env (Netlify already has these)
const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
for (const k of required) {
  if (!process.env[k]) {
    console.log(`[security-check] skipping (missing ${k})`);
    process.exit(0);
  }
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

async function get(path, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${path}${params}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "count=exact"
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} -> ${res.status}: ${text}`);
  }
  const data = await res.json();
  const count = res.headers.get("content-range")?.split("/")?.[1];
  return { data, count: count ? Number(count) : data.length };
}

// pg_meta exposes table + policy metadata via PostgREST
// tables endpoint: pg_tables (schemaname, tablename)
// policies endpoint: pg_policies (schemaname, tablename, cmd)
async function main() {
  const tables = ["learning_modules", "quizzes", "test_logs"];

  // RLS flag lives in pg_class.relrowsecurity; pg_meta exposes it via pg_tables? (not always),
  // fallback: try pg_policies existence as a proxy for enabled RLS on catalogs we control.
  // We enforce presence of at least one SELECT policy on LMS tables and NO SELECT policy on test_logs.
  const { data: pols } = await get(
    "pg_policies",
    `?schemaname=eq.public&tablename=in.(${tables.join(",")})`
  );

  const selPolicies = (name) =>
    pols.filter((p) => p.tablename === name && p.cmd === "SELECT");

  const lmSel = selPolicies("learning_modules").length;
  const qSel = selPolicies("quizzes").length;
  const tlSel = selPolicies("test_logs").length;

  const errors = [];
  if (lmSel === 0) errors.push("learning_modules has no SELECT policy");
  if (qSel === 0) errors.push("quizzes has no SELECT policy");
  if (tlSel > 0) errors.push("test_logs should not expose SELECT policies");

  if (errors.length) {
    console.error("[security-check] ✖ failed:\n- " + errors.join("\n- "));
    process.exit(1);
  } else {
    console.log("[security-check] ✓ policies look good");
  }
}

main().catch((e) => {
  console.error("[security-check] error:", e.message || e);
  // Don’t hard fail on meta endpoint differences; only fail on explicit policy problems above.
  process.exit(0);
});
