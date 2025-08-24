import * as React from "react";

type Character = {
  id: string;
  name?: string;
  image: string; // file name inside /public/kingdoms/<Kingdom>/
};

function stripExt(s: string) {
  return s.replace(/\.[^.]+$/, "");
}

function coerceCharacters(raw: any): Character[] {
  // Flexible reader: supports a few simple manifest shapes
  if (!raw) return [];
  if (Array.isArray(raw)) {
    // ["Koala.png", "Platapus.png"]
    return raw
      .filter((x) => typeof x === "string" && x.toLowerCase().endsWith(".png"))
      .map((image) => ({ id: stripExt(image), image }));
  }
  if (Array.isArray(raw.characters)) {
    // { characters: [...] }
    return raw.characters
      .filter((c: any) => typeof c === "string" || (c && typeof c.image === "string"))
      .map((c: any) =>
        typeof c === "string"
          ? { id: stripExt(c), image: c }
          : { id: c.id ?? stripExt(c.image), name: c.name, image: c.image },
      );
  }
  if (Array.isArray(raw.images)) {
    // { images: ["Koala.png", ...] }
    return raw.images
      .filter((x: any) => typeof x === "string" && x.toLowerCase().endsWith(".png"))
      .map((image: string) => ({ id: stripExt(image), image }));
  }
  return [];
}

export function CharacterGrid({ kingdom }: { kingdom: string }) {
  const [chars, setChars] = React.useState<Character[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/kingdoms/${kingdom}/manifest.json`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) {
            if (!cancelled) setChars([]); // no manifest yet
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const raw = await res.json();
        const list = coerceCharacters(raw);
        if (!cancelled) setChars(list);
      } catch (e: any) {
        if (!cancelled) {
          setError("Could not load characters.");
          setChars([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kingdom]);

  if (error) {
    return (
      <p role="status" aria-live="polite">
        {error}
      </p>
    );
  }

  if (chars === null) {
    // simple skeletons
    return (
      <div className="nv-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="nv-card nv-skel" />
        ))}
      </div>
    );
  }

  if (chars.length === 0) {
    return <p>Characters coming soon.</p>;
  }

  return (
    <div className="nv-grid">
      {chars.map((c) => (
        <a
          key={c.id}
          className="nv-card"
          href={`/characters/${encodeURIComponent(c.id)}`}
          aria-label={c.name ?? c.id}
        >
          <img
            loading="lazy"
            decoding="async"
            src={`/kingdoms/${kingdom}/${c.image}`}
            alt={c.name ?? c.id}
          />
          <div className="nv-card-title">{c.name ?? c.id}</div>
        </a>
      ))}
    </div>
  );
}

// Minimal styles (scoped)
export const characterGridStyles = `
.nv-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (min-width: 640px) { .nv-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px){ .nv-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

.nv-card {
  border: 1.5px solid #2c55d3;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  text-decoration: none;
}
.nv-card img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  aspect-ratio: 4 / 5;
}
.nv-card-title {
  margin-top: 8px;
  font-weight: 700;
  color: #2242a2;
}
.nv-skel {
  background: #eef2ff;
  aspect-ratio: 4 / 5;
  border-radius: 16px;
}
`;

