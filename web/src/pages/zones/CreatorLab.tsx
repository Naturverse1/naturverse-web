import React, { useState } from "react";

export default function CreatorLab() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const generate = () => {
    // Placeholder: deterministic, no API yet
    setOutput(
      `Once upon a time, ${prompt || "a curious explorer"} found a glowing seed.\n` +
        `Planted with kindness, it sprouted a new world in the Naturverse.`
    );
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Creator Lab</h1>
      <p className="text-white/80 mt-2">Craft stories and characters. We’ll connect AI later.</p>

      <div className="mt-6 space-y-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A tiny dragon who loves rainy days…"
          className="w-full rounded-md bg-white/10 px-3 py-2 outline-none"
        />
        <div className="flex gap-2">
          <button onClick={generate} className="rounded-md bg-sky-600 px-4 py-2">
            Make a mini-story
          </button>
          <button
            onClick={() => {
              setPrompt("");
              setOutput(null);
            }}
            className="rounded-md bg-white/10 px-4 py-2"
          >
            Clear
          </button>
        </div>
        {output && (
          <pre className="whitespace-pre-wrap rounded-md border border-white/10 bg-white/5 p-4">{output}</pre>
        )}
      </div>
    </main>
  );
}
