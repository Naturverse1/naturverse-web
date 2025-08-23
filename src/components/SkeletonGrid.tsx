import React from "react";

export default function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton">
          <div className="sk-img" />
          <div className="sk-line" />
          <div className="sk-line small" />
        </div>
      ))}
    </div>
  );
}
