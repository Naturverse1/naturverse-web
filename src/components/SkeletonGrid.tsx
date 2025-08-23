import React from "react";

export default function SkeletonGrid({ rows = 6 }: { rows?: number }) {
  return (
    <div className="cards">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="card skeleton" key={i} aria-hidden="true">
          <div className="sk-img" />
          <div className="sk-line" />
          <div className="sk-line short" />
        </div>
      ))}
    </div>
  );
}
