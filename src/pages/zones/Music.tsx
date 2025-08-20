import React from "react";
import PromptForm from "../../components/PromptForm";
import { aiComplete } from "../../lib/openai";

export default function MusicZone() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Music Zone</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">AI Song Maker</h2>
          <PromptForm
            label="Describe your song vibe"
            placeholder="Upbeat rainforest beat with parrots and drums…"
            button="Make Lyrics"
            onRun={(p)=>aiComplete({ prompt: `Write a short kid-friendly song chorus about: ${p}` }).then(r=>r.text)}
          />
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Karaoke</h2>
          <div className="border rounded p-3">Upload & play-along coming soon.</div>
        </section>
      </div>
    </div>
  );
}
