import { track } from "@/lib/analytics";

const KEY = "nv.exp.assignments.v1";

type Assignments = Record<string, string>;

function load(): Assignments {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function save(a: Assignments) { localStorage.setItem(KEY, JSON.stringify(a)); }

export function assign(exp: string, variants: string[], weights?: number[]) {
  const map = load();
  if (map[exp]) return map[exp];
  const pick = () => {
    if (!weights || weights.length !== variants.length) {
      return variants[Math.floor(Math.random() * variants.length)];
    }
    const sum = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < variants.length; i++) {
      r -= weights[i];
      if (r <= 0) return variants[i];
    }
    return variants[variants.length - 1];
  };
  map[exp] = pick();
  save(map);
  return map[exp];
}

export function getVariant(exp: string) {
  return load()[exp];
}

export async function expose(exp: string, variant: string, meta?: Record<string, any>) {
  track("exp_expose", { exp, variant });
  try {
    await fetch("/.netlify/functions/exp-event", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "expose", exp, variant, meta })
    });
  } catch {}
}

export async function convert(exp: string, variant: string, meta?: Record<string, any>) {
  track("exp_convert", { exp, variant });
  try {
    await fetch("/.netlify/functions/exp-event", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "convert", exp, variant, meta })
    });
  } catch {}
}
