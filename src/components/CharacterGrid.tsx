import React from "react";
import galleries from "../data/kingdom-galleries.json";
import LazyImage from "./LazyImage";

type Props = { kingdom: string };

export default function CharacterGrid({ kingdom }: Props) {
  const items: string[] = (galleries as Record<string, string[]>)[kingdom] || [];
  if (!items.length) {
    return <p>Characters coming soon.</p>;
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "12px",
      }}
    >
      {items.map((rel) => {
        const src = rel.startsWith("/") ? rel : `/${rel}`;
        return (
          <a
            key={src}
            href={src}
            style={{
              display: "block",
              border: "1px solid #d3d9f0",
              borderRadius: "14px",
              padding: "10px",
              background: "#fff",
              aspectRatio: "1 / 1",
            }}
          >
            <LazyImage
              src={src}
              alt=""
              width="100%"
              height="100%"
            />
          </a>
        );
      })}
    </div>
  );
}

