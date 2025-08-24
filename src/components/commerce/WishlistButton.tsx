import { useWishlist } from "../../context/WishlistContext";

export default function WishlistButton({ slug }: { slug: string }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      aria-pressed={on}
      onClick={() => toggle(slug)}
      className="btn btn-secondary"
    >
      {on ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
