import React, { useState } from "react";
import PromptForm from "../../components/PromptForm";
import { aiComplete } from "../../lib/openai";

export default function NavatarCreator() {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Navatar Creator</h1>
      <p className="text-neutral-700">Choose a type, generate a backstory & powers, and save your character card.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium">Navatar Type</label>
          <select className="border rounded p-2 w-full">
            <option>Animal</option>
            <option>Fruit</option>
            <option>Insect</option>
            <option>Spirit</option>
          </select>

          <PromptForm
            label="Describe your idea"
            placeholder="A brave durian ranger from Thailandia who loves elephants…"
            button="Generate Story"
            onRun={(p)=>aiComplete({ system: "You write short kid-friendly character bios with powers.", prompt: p }).then(r=>r.text)}
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm text-neutral-600">Visual placeholder (AI image gen later)</div>
          <div className="border rounded p-3 h-64 flex items-center justify-center bg-neutral-50">
            {preview ? <img src={preview} className="max-h-60 rounded" /> : <span>No image yet</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
