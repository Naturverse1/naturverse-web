import React, { useState } from "react";

export default function PromptForm(props: { label: string; placeholder: string; onRun: (p: string) => Promise<string>; button?: string }) {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{props.label}</label>
      <textarea className="w-full border rounded p-2" rows={4} placeholder={props.placeholder} value={input} onChange={(e)=>setInput(e.target.value)} />
      <button
        onClick={async()=>{ setLoading(true); try{ const t = await props.onRun(input); setOut(t);} finally{ setLoading(false);} }}
        disabled={loading}
        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
      >
        {loading ? "Working..." : (props.button || "Generate")}
      </button>
      {!!out && (
        <pre className="whitespace-pre-wrap bg-neutral-50 border rounded p-3 text-sm">{out}</pre>
      )}
    </div>
  );
}
