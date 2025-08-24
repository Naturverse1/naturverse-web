import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/commerce/ProductCard";
import { products } from "../../lib/commerce/products";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { items } = useWishlist();
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
        <div className="market-grid">
          {liked.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <p>No saved items yet.</p>
      )}
    </section>
  );
}
