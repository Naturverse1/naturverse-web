import { FormEvent, useEffect, useState } from "react";
import { getMyCharacterCard, saveCharacterCard } from "@/lib/navatarApi";

export default function CharacterCardPage() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState("");
  const [traits, setTraits] = useState("");

  useEffect(() => {
    (async () => {
      const c = await getMyCharacterCard();
      if (c) {
        setName(c.name ?? "");
        setSpecies(c.species ?? "");
        setKingdom(c.kingdom ?? "");
        setBackstory(c.backstory ?? "");
        setPowers((c.powers ?? []).join(', '));
        setTraits((c.traits ?? []).join(', '));
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await saveCharacterCard({
        name,
        species,
        kingdom,
        backstory,
        powers: powers ? powers.split(',').map(s => s.trim()).filter(Boolean) : null,
        traits: traits ? traits.split(',').map(s => s.trim()).filter(Boolean) : null
      });
      alert("Saved!");
      location.assign("/navatar");
    } catch (e: any) {
      alert(`Save failed: ${e.message}`);
    }
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="text-sm text-blue-600 mb-2"><a href="/">Home</a> / <a href="/navatar">Navatar</a> / Card</div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Character Card</h1>

      <form onSubmit={onSubmit} className="max-w-xl rounded-2xl bg-white shadow p-4 space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"
          className="w-full border rounded px-3 py-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={species} onChange={e=>setSpecies(e.target.value)} placeholder="Species / Type"
            className="w-full border rounded px-3 py-2" />
          <input value={kingdom} onChange={e=>setKingdom(e.target.value)} placeholder="Kingdom"
            className="w-full border rounded px-3 py-2" />
        </div>
        <textarea value={backstory} onChange={e=>setBackstory(e.target.value)} placeholder="Backstory"
          rows={4} className="w-full border rounded px-3 py-2" />
        <input value={powers} onChange={e=>setPowers(e.target.value)} placeholder="Powers (comma separated)"
          className="w-full border rounded px-3 py-2" />
        <input value={traits} onChange={e=>setTraits(e.target.value)} placeholder="Traits (comma separated)"
          className="w-full border rounded px-3 py-2" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
      </form>
    </div>
  );
}
