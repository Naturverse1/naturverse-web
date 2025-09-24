import { useEffect, useState } from "react";

import { useWishlist } from "@/context/WishlistContext";

import { get, set } from "../utils/storage";
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
  const wishlist = useWishlist();
  const [busy, setBusy] = useState(false);

  if (props.kind === "product") {
    const slug = props.id.startsWith("product:") ? props.id.slice("product:".length) : props.id;
    const saved = wishlist.has(slug);

    const handleClick = async () => {
      if (busy) return;
      try {
        setBusy(true);
        const next = await wishlist.toggle(slug);
        toast({
          text: next ? "Saved to Wishlist ⭐" : "Removed from Wishlist",
          kind: next ? "ok" : "warn",
        });
      } catch (error: any) {
        const message = error?.message ?? "";
        if (message === "not_signed_in") {
          toast({ text: "Sign in to save items", kind: "warn" });
        } else {
          toast({ text: "Unable to update wishlist", kind: "err" });
        }
      } finally {
        setBusy(false);
      }
    };

    return (
      <button
        className="btn save-btn"
        onClick={() => {
          void handleClick();
        }}
        aria-pressed={saved}
        disabled={wishlist.loading || busy}
        title={saved ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  const items = get<Item[]>(KEY, []);
  const exists = items.some((i) => i.id === props.id);

  function persist(next: Item[]) {
    set(KEY, next);
  }

  return (
    <button
      className="btn save-btn"
      onClick={() => {
        const list = get<Item[]>(KEY, []);
        if (exists) {
          persist(list.filter((i) => i.id !== props.id));
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
