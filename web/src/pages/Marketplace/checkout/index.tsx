import { useState } from "react";
import type { Address } from "../../../types/commerce";
import AddressForm from "../../../components/AddressForm";
import { useNavigate } from "react-router-dom";

export default function Shipping() {
  const nav = useNavigate();
  const [addr, setAddr] = useState<Address | null>(null);
  return (
    <section>
      <h1>Checkout — Shipping</h1>
      {addr ? (
        <>
          <pre>{JSON.stringify(addr, null, 2)}</pre>
          <button onClick={()=>nav("/marketplace/checkout/Review", { state:{ addr } })}>Continue to Review</button>
        </>
      ) : <AddressForm onSubmit={setAddr} />}
    </section>
  );
}
