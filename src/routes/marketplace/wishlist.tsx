import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import { products } from "../../lib/commerce/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { add } = useCart();
  const { items, toggle } = useWishlist();
  const liked = products.filter((p) => items.includes(p.slug));
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
      {liked.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liked.map((p) => (
            <ProductCard
              key={p.slug}
              product={{ ...p, saved: true }}
              onAddToCart={(item) => add(item)}
              onToggleSave={(item) => toggle(item.slug)}
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
