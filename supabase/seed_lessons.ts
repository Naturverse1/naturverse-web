import { createClient } from "../lib/supabase-client";

const supabase = createClient();

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
