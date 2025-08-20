import React from "react";
import PromptForm from "../../components/PromptForm";
import { aiComplete } from "../../lib/openai";

export default function Stories() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Stories</h1>
      <PromptForm
        label="Start a story prompt"
        placeholder="Turian the Durian enters the rainforest market and finds a glowing map… give me 3 choices."
        button="Create Chapter"
        onRun={(p)=>aiComplete({ system: "Write a short chapter and end with 3 numbered choices.", prompt: p }).then(r=>r.text)}
      />
    </div>
  );
}
