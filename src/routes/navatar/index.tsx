import { useState } from "react";
const types = ["Animal","Fruit","Insect","Spirit"] as const;
export default function Navatar() {
  const [sel,setSel] = useState<typeof types[number] | null>("Animal");
    return (
      <section className="space-y-4 navatar-page">
      <h2 className="text-2xl font-bold">Navatar Creator</h2>
      <p className="text-gray-600">Choose a base type and generate a backstory later.</p>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {types.map(t=>(
          <button key={t}
            onClick={()=>setSel(t)}
            className={"rounded border p-4 text-left " + (sel===t?"ring-2 ring-green-500":"")}>
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-gray-600">Select</div>
          </button>
        ))}
      </div>
      <div className="text-sm">Selected: <strong>{sel ?? "None"}</strong></div>
      <button className="rounded border px-3 py-1 opacity-60 cursor-not-allowed">Save Navatar (stub)</button>
    </section>
  );
}
