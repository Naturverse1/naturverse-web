const NEED = {
  SUPABASE_URL: ["VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"],
  SUPABASE_ANON_KEY: ["VITE_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
};

const missing = [];
for (const base of Object.keys(NEED)) {
  const found =
    process.env[base] ?? NEED[base].map((k) => process.env[k]).find(Boolean);
  if (!found)
    missing.push(`${base} (or ${NEED[base].join(" / ")})`);
}

if (missing.length) {
  console.error(`Missing required env var(s): ${missing.join(", ")}`);
  process.exit(1);
}
console.log("Netlify environment check passed.");

