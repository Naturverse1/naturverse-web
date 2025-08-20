import { useState } from "react";
import type { NavatarTraits } from "@/lib/navatar";

const REALMS = ["animal", "fruit", "insect", "spirit"] as const;
const COLORS = ["#7dd3fc","#a7f3d0","#fde68a","#fda4af","#c4b5fd","#fca5a5","#fef08a"];
const SPECIES: Record<NavatarTraits["realm"], string[]> = {
  animal: ["Panda","Elephant","Hedgehog","Parrot","Tiger","Kangaroo","Penguin"],
  fruit: ["Durian","Mango","Banana","Coconut","Kiwi","Lemon","Peach"],
  insect: ["Butterfly","Bee","Ladybug","Dragonfly","Firefly","Caterpillar"],
  spirit: ["Forest Spirit","River Sprite","Sky Wisp","Sunbeam","Moonlight"],
};

type Props = {
  value: NavatarTraits;
  onChange: (t: NavatarTraits) => void;
};

export default function TraitSelector({ value, onChange }: Props) {
  const [local, setLocal] = useState<NavatarTraits>(value);

  function update<K extends keyof NavatarTraits>(k: K, v: NavatarTraits[K]) {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  }

  return (
    <div className="stack gap-3">
      <div>
        <label>Realm</label>
        <div className="row wrap gap-2">
          {REALMS.map(r => (
            <button
              key={r}
              className={`chip ${local.realm===r ? "chip--active":""}`}
              onClick={() => update("realm", r)}
              type="button"
            >{r}</button>
          ))}
        </div>
      </div>

      <div>
        <label>Species</label>
        <select value={local.species} onChange={e => update("species", e.target.value)}>
          {SPECIES[local.realm].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label>Color</label>
        <div className="row gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              aria-label={c}
              onClick={() => update("color", c)}
              type="button"
              style={{ width: 28, height: 28, borderRadius: 999, background: c, border: local.color===c ? "2px solid #111" : "2px solid #fff" }}
            />
          ))}
        </div>
      </div>

      <div>
        <label>Eyes</label>
        <select value={local.eyes} onChange={e => update("eyes", e.target.value as any)}>
          <option value="happy">happy</option>
          <option value="kind">kind</option>
          <option value="sleepy">sleepy</option>
          <option value="hero">hero</option>
        </select>
      </div>

      <div>
        <label>Accessory</label>
        <select value={local.accessory ?? "none"} onChange={e => update("accessory", e.target.value as any)}>
          <option value="none">none</option>
          <option value="crown">crown</option>
          <option value="flower">flower</option>
          <option value="glasses">glasses</option>
          <option value="scarf">scarf</option>
        </select>
      </div>
    </div>
  );
}
