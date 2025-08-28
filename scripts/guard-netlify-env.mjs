const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error("\nMissing required environment variables:\n  " + missing.join("\n  "));
  console.error("\nPlease set the variables in your Netlify project settings.\n");
  process.exit(1);
}
console.log("Netlify environment check passed.");
