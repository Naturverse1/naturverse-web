import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BackInStockForm({ sku }: { sku: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase!.from("back_in_stock").insert({ sku, email });
    setStatus(error ? "err" : "ok");
  }

  if (status === "ok") return <p>We’ll email you when it’s back 🙌</p>;
  if (status === "err") return <p>Oops, try again shortly.</p>;

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Notify me</button>
    </form>
  );
}
