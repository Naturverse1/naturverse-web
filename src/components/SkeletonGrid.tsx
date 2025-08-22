import React from "react";

export default function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="cards">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card sk" key={i}>
          <div className="sk-thumb"></div>
          <div className="sk-line"></div>
          <div className="sk-line small"></div>
        </div>
      ))}
    </div>
  );
}
