import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { add } = useCart();
  const { entries, toggle, loading } = useWishlist();
  const hasItems = entries.length > 0;

  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Wishlist", href: "/marketplace/wishlist" },
        ]}
      />
      <h1>Wishlist</h1>
      {loading ? (
        <p>Loading wishlist…</p>
      ) : hasItems ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ product }) => (
            <ProductCard
              key={product.id}
              product={{ ...product, saved: true }}
              onAddToCart={(item) => add(item)}
              onToggleSave={(item) => toggle(item.id)}
              showCartButton
              showSaveButton
            />
          ))}
        </div>
      ) : (
        <p>No saved items yet.</p>
      )}
    </section>
  );
}
