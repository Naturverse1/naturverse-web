import React from "react";

export default function UploadButton({ accept, onSelect }: { accept?: string; onSelect: (f: File) => void }) {
  return (
    <label className="inline-flex items-center gap-2 px-3 py-2 rounded border cursor-pointer">
      <span>Choose file</span>
      <input type="file" className="hidden" accept={accept} onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onSelect(f);
      }} />
    </label>
  );
}
