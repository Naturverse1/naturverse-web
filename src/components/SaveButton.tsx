import { get, set } from "../utils/storage";
import { useEffect, useState } from "react";
import { useToast } from "./Toast";

type Item = { id: string; kind: "world" | "zone" | "product" | "navatar"; title: string; href?: string; payload?: unknown; }
const KEY = "library";

export function useLibrary() {
  const [items, setItems] = useState<Item[]>(() => get<Item[]>(KEY, []));
  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (detail?.key === KEY) setItems(get<Item[]>(KEY, []));
    };
    window.addEventListener("naturverse:v1:changed", on as EventListener);
    return () => window.removeEventListener("naturverse:v1:changed", on as EventListener);
  }, []);
  return items;
}

export default function SaveButton(props: Item) {
  const toast = useToast();
  const items = get<Item[]>(KEY, []);
  const exists = items.some(i => i.id === props.id);

  function persist(next: Item[]) { set(KEY, next); }

  return (
    <button
      className="btn save-btn"
      onClick={() => {
        const list = get<Item[]>(KEY, []);
        if (exists) {
          persist(list.filter(i => i.id !== props.id));
          toast({ text: "Removed from Library", kind: "warn" });
        } else {
          persist([{ ...props }, ...list].slice(0, 200));
          toast({ text: "Saved to Library ⭐", kind: "ok" });
        }
      }}
      aria-pressed={exists}
      title={exists ? "Remove from Library" : "Save to Library"}
    >
      {exists ? "Saved" : "Save"}
    </button>
  );
}
