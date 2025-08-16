import React from "react";

export default function ProgressBadge({ done, total }: { done: number; total: number }) {
  const complete = done >= total && total > 0;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
        complete ? "bg-emerald-600/80 text-white" : "bg-white/10 text-white"
      }`}
      title={complete ? "Unit complete!" : "Keep going"}
    >
      <span>{done}/{total}</span>
      <span>{complete ? "⭐ Completed" : "Progress"}</span>
    </div>
  );
}
