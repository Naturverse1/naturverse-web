export type PublicNavatar = { name: string; src: string };

function labelFromFilename(f: string) {
  const base = f.replace(/\.[a-z0-9]+$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function loadPublicNavatars(): Promise<PublicNavatar[]> {
  try {
    const res = await fetch("/navatars/manifest.json", { cache: "no-store" });
    if (res.ok) {
      const files: string[] = await res.json();
      return files.map((f) => ({ name: labelFromFilename(f), src: `/navatars/${f}` }));
    }
  } catch {}
  const fallback = ["turian.png", "koala.png", "bald-eagle.png", "pixie.png", "tiger.png"];
  return fallback.map((f) => ({ name: labelFromFilename(f), src: `/navatars/${f}` }));
}

