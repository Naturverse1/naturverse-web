import { useEffect, useState } from "react";
import { UPSELLS } from "@/lib/upsell";

export default function CheckoutBanner() {
  const [msg, setMsg] = useState<string | null>(null);
  const [offer, setOffer] = useState<{sku:string; title:string; price:number; blurb:string} | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const success = p.get("checkout") === "success";
    if (success) {
      setMsg("✅ Payment successful! Thank you.");
      const o = UPSELLS.sort((a,b)=>a.price-b.price)[0];
      setOffer(o);
    }
    if (p.get("checkout") === "cancel") setMsg("❌ Payment canceled. Please try again.");
  }, []);

  function buyUpsell() {
    alert("Checkout is currently unavailable.");
  }

  if (!msg) return null;

  return (
    <div className="checkout-banner">
      <div>{msg}</div>
      {offer && (
        <div className="upsell">
          <div>
            <strong>Special offer:</strong> {offer.title} — ${(offer.price/100).toFixed(2)}
            <div className="muted">{offer.blurb}</div>
          </div>
          <button onClick={buyUpsell}>Add now →</button>
        </div>
      )}
      <style>{`
        .checkout-banner{background:#4caf50;color:#fff;padding:.6rem 1rem}
        .upsell{margin-top:.5rem;display:flex;gap:10px;align-items:center;justify-content:space-between}
        .muted{opacity:.85}
      `}</style>
    </div>
  );
}
