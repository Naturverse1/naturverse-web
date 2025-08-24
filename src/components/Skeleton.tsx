import React from "react";

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="sk sk-img" />
          <div className="sk sk-line" />
          <div className="sk sk-line short" />
        </div>
      ))}
    </div>
  );
}
