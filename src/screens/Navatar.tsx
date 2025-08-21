import React, { useState } from "react";
export default function Navatar(){
  const [kind, setKind] = useState("Animal");
  return (
    <section>
      <h1 className="h1">Navatar Creator</h1>
      <div className="p">Choose a base type and generate a backstory later.</div>
      <div className="grid">
        {["Animal","Fruit","Insect","Spirit"].map(k=>(
          <button key={k} className="card" onClick={()=>setKind(k)}>
            <h3>{k}</h3><div className="small">Select</div>
          </button>
        ))}
      </div>
      <p className="p">Selected: <b>{kind}</b></p>
      <button className="btn">Save Navatar (stub)</button>
    </section>
  );
}
