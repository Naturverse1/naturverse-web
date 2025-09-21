import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY).");
}

const supabase = createClient(url, key);

const lessons = [
  {
    zone: "NaturBank",
    title: "What is a Crypto Wallet?",
    content: "A crypto wallet stores your private keys ...",
  },
  {
    zone: "NaturBank",
    title: "Custodial vs Non-Custodial",
    content: "Custodial means someone else manages your keys ...",
  },
  {
    zone: "NaturBank",
    title: "Web3 Safety",
    content: "Never share your seed phrase ...",
  }
];

for (const lesson of lessons) {
  await supabase.from("nv_lessons").insert(lesson);
}
