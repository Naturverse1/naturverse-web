// Central helpers for reading the public/navatars manifest and tracking the active pick

export type Navatar = {
  name: string;
  src: string;   // public URL like /navatars/xxx.png
};

const LS_KEY = "nv.activeNavatar"; // persisted across pages

export function saveActiveNavatar(n: Navatar | null) {
  if (!n) {
    localStorage.removeItem(LS_KEY);
  } else {
    localStorage.setItem(LS_KEY, JSON.stringify(n));
  }
}

export function loadActiveNavatar(): Navatar | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Navatar;
  } catch {
    return null;
  }
}

export async function loadNavatarList(): Promise<Navatar[]> {
  // Source of truth is /public/navatars + index.json
  const res = await fetch("/navatars/index.json", { cache: "no-cache" });
  if (!res.ok) return [];
  const files: string[] = await res.json();
  return files
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => ({
      name: filenameToName(f),
      src: `/navatars/${f}`,
    }));
}

function filenameToName(file: string): string {
  const base = file.replace(/\.(png|jpe?g|webp)$/i, "");
  return base.replace(/[_-]+/g, " ");
}

