const NEED = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

const missing = NEED.filter((k) => !process.env[k]);

if (missing.length) {
  console.error(`Missing required env var(s): ${missing.join(", ")}`);
  process.exit(1);
}
console.log("Netlify environment check passed.");

