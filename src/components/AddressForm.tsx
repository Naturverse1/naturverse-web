import { useState } from "react";
import type { Address } from "../types/commerce";

export default function AddressForm({ onSubmit }: { onSubmit: (a: Address)=>void }) {
  const [a, setA] = useState<Address>({name:"",email:"",address1:"",city:"",postal:"",country:""});
  const up = (k: keyof Address) => (e:any)=> setA(s=>({...s,[k]:e.target.value}));
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(a);}} style={{display:"grid",gap:8}}>
      <input placeholder="Name" value={a.name} onChange={up("name")} required />
      <input placeholder="Email" value={a.email} onChange={up("email")} required />
      <input placeholder="Phone" value={a.phone||""} onChange={up("phone")} />
      <input placeholder="Address line 1" value={a.address1} onChange={up("address1")} required />
      <input placeholder="Address line 2" value={a.address2||""} onChange={up("address2")} />
      <input placeholder="City" value={a.city} onChange={up("city")} required />
      <input placeholder="Region/State" value={a.region||""} onChange={up("region")} />
      <input placeholder="Postal code" value={a.postal} onChange={up("postal")} required />
      <input placeholder="Country" value={a.country} onChange={up("country")} required />
      <button type="submit">Continue</button>
    </form>
  );
}

