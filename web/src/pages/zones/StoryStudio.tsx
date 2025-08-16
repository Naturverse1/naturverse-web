import React, { useEffect, useState } from "react";
import { Breadcrumbs } from '../../components/Breadcrumbs';

type Draft = { title: string; outline: string[] };

export default function StoryStudio() {
  const [prompt, setPrompt] = useState("");
  const [outline, setOutline] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const raw = localStorage.getItem("storyStudioDrafts");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("storyStudioDrafts", JSON.stringify(drafts));
  }, [drafts]);

  function generate() {
    if (prompt) {
      setOutline([prompt, prompt, prompt]);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  function saveDraft() {
    if (!prompt || outline.length === 0) return;
    const next = [...drafts, { title: prompt, outline }];
    setDrafts(next);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "Zones", to: "/zones" },
          { label: "Story Studio" }
        ]}
      />
      <h1 className="text-3xl font-bold">Story Studio</h1>
      <p className="text-white/80 mt-2">Write and illustrate short adventures.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Prompt Starter</h2>
        <input
          className="mt-3 w-full rounded bg-white/10 p-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={generate} className="mt-3 rounded-md bg-sky-600 px-4 py-2">
          Generate outline
        </button>
        {outline.length > 0 && (
          <ul className="list-disc pl-6 mt-3 text-white/80">
            {outline.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Illustration Sketch</h2>
        <input type="file" accept="image/*" className="mt-3" onChange={onFile} />
        {image && <img src={image} alt="preview" className="mt-3 max-h-64" />}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Save Draft</h2>
        <button onClick={saveDraft} className="mt-3 rounded-md bg-white/10 px-4 py-2">
          Save Draft
        </button>
        {drafts.length > 0 && (
          <ul className="list-disc pl-6 mt-3 text-white/80">
            {drafts.map((d, i) => (
              <li key={i}>{d.title}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
