import React from "react";
import NVImage from "../utils/NVImage";
import { toggleWish, isWished } from "../utils/wishlist";
import "./market.css";
import { checkout } from "../lib/stripeCheckout";

type Props = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  image?: string;
  price: number;
  category: string;
  onChange?: () => void;
};

export default function ProductCard(p: Props) {
  const [wish, setWish] = React.useState<boolean>(() => isWished(p.id));

  function onWish() {
    const next = toggleWish(p.id);
    setWish(next);
    p.onChange?.();
  }

  const url = `/marketplace/${p.slug}`;

  async function onBuy() {
    try {
      await checkout(
        [
          {
            price_data: {
              currency: "usd",
              unit_amount: p.price * 100,
              product_data: { name: p.name, description: p.summary },
            },
            quantity: 1,
            metadata: { product: p.id },
          },
        ],
        { metadata: { feature: "marketplace" } }
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <article className="product">
      <a className="product__image" href={url} aria-label={`Open ${p.name}`}>
        {p.image ? (
          <NVImage
            alt={p.name}
            src={p.image}
            width={320}
            height={200}
            className="nv-object-cover"
            sizes="(max-width: 768px) 90vw, 320px"
            placeholder="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%23f2f4f7' width='100%25' height='100%25'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="product__ph" />
        )}
      </a>

      <div className="product__body">
        <header className="product__header">
          <h3 className="product__title"><a href={url}>{p.name}</a></h3>
          <button
            className={`product__wish ${wish ? "is-on" : ""}`}
            onClick={onWish}
            aria-pressed={wish}
            aria-label={wish ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
            title={wish ? "Wishlisted" : "Add to wishlist"}
          >
            ♥
          </button>
        </header>
        <p className="product__meta">
          <span className={`product__cat c-${p.category.toLowerCase()}`}>{p.category}</span>
          <span className="product__price">${p.price}</span>
        </p>
        <p className="product__summary">{p.summary}</p>
        <div className="product__actions">
          <a className="btn" href={url}>View</a>
          <button className="btn ghost" onClick={onBuy}>Buy</button>
        </div>
      </div>
    </article>
  );
}
