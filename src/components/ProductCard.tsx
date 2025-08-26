import { Link } from "react-router-dom";
import { Product } from "../lib/commerce/types";
import LazyImage from "./LazyImage";

type CardProduct = Product & { saved?: boolean };

type Props = {
  product: CardProduct;
  onAddToCart?: (p: Product) => void;
  onToggleSave?: (p: Product) => void;
  showCartButton?: boolean;
  showSaveButton?: boolean;
};

export default function ProductCard({
  product,
  onAddToCart,
  onToggleSave,
  showCartButton = true,
  showSaveButton = true,
}: Props) {
  return (
    <div className="rounded-2xl border border-blue-200/60 p-4 shadow-sm">
      <div className="rounded-2xl bg-blue-50/40 p-4">
        <div className="mx-auto flex h-48 w-full items-center justify-center overflow-hidden rounded-xl">
          <LazyImage
            className="prod-thumb"
            src={product.image}
            alt={product.name}
            width={320}
            height={320}
          />
        </div>
      </div>

      <Link
        to={`/marketplace/${product.slug}`}
        className="mt-3 block text-xl font-bold text-blue-700 underline"
      >
        {product.name}
      </Link>

      <div className="mt-1 text-gray-800">${product.price.toFixed(2)}</div>

      <div className="mt-3 flex gap-3">
        {showCartButton && (
          <button
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm active:translate-y-[1px]"
            onClick={() => onAddToCart?.(product)}
          >
            Add to cart
          </button>
        )}
        {showSaveButton && (
          <button
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm active:translate-y-[1px]"
            onClick={() => onToggleSave?.(product)}
            aria-pressed={!!product.saved}
          >
            {product.saved ? "Saved" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

