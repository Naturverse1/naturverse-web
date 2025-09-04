import ProductCard from "../../components/ProductCard";
import { products } from "../../lib/commerce/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import MarketplaceTabs from '@/components/MarketplaceTabs';

export default function Marketplace() {
  const { add } = useCart();
  const wishlist = useWishlist();
  return (
    <section>
      <MarketplaceTabs />
      <h1>Marketplace</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            product={{ ...p, saved: wishlist.has(p.slug) }}
            onAddToCart={(item) => add(item)}
            onToggleSave={(item) => wishlist.toggle(item.slug)}
            showCartButton
            showSaveButton
          />
        ))}
      </div>
    </section>
  );
}
