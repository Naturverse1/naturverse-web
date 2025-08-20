import React from "react";
import PromptForm from "../../components/PromptForm";
import { aiComplete } from "../../lib/openai";

export default function CreatorLab() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Creator Lab</h1>
      <PromptForm
        label="Describe the art or card you want to make"
        placeholder="Character card for Turian the Durian: brave, funny, elephant friend…"
        button="Generate Card Text"
        onRun={(p)=>aiComplete({ system: "Return a compact character card with name, traits, powers.", prompt: p }).then(r=>r.text)}
      />
      <div className="text-sm text-neutral-600">AI image rendering to be added later.</div>
    </div>
  );
}
