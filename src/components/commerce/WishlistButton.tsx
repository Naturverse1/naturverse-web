import { useState } from "react";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistButton({ productId }: { productId: string }) {
  const { has, toggle } = useWishlist();
  const [busy, setBusy] = useState(false);
  const on = has(productId);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      await toggle(productId);
    } catch (err) {
      console.error("Wishlist toggle failed", err);
      const message =
        err instanceof Error && err.message === "not_signed_in"
          ? "Please sign in to update your wishlist"
          : "Unable to update wishlist";
      alert(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      aria-pressed={on}
      onClick={handleClick}
      className="btn btn-secondary"
      disabled={busy}
    >
      {on ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
