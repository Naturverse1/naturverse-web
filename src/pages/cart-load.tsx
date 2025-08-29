import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

export default function CartLoad() {
  const { addToCart } = useCart();
  const [msg, setMsg] = useState("Loading cart…");

  useEffect(() => {
    const code = window.location.pathname.split("/").pop();
    fetch(`/.netlify/functions/get-cart?code=${encodeURIComponent(code || "")}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json() as Promise<{ id: string; qty: number }[]>;
      })
      .then((lines) => {
        lines.forEach((l) =>
          addToCart(
            { id: l.id, name: l.id, price: 0, type: "digital" } as any,
            l.qty
          )
        );
        setMsg("Cart loaded ✔");
        setTimeout(() => (location.href = "/checkout"), 500);
      })
      .catch((e) => setMsg(`Not found: ${e.message}`));
  }, [addToCart]);

  return (
    <main className="container" style={{ padding: 24 }}>
      <p>{msg}</p>
    </main>
  );
}
