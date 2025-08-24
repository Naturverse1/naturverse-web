import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

export default function CartPage() {
  return (
    <main id="main" className="page-wrap">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/marketplace", label: "Marketplace" }, { label: "Cart" }]} />
      <h1>Cart</h1>
      <p className="sub">Review items and checkout.</p>

      <section className="card empty">
        <div className="icon">
          <img src="/favicon-32x32.png" alt="Naturverse" width={48} height={48} />
        </div>
        <h2>Your cart is empty</h2>
        <p>When you add something, it will show up here.</p>
        <Link className="btn" to="/marketplace">Continue shopping</Link>
      </section>

      <style>{`
        .page-wrap { max-width: 960px; margin: 0 auto; padding: 1rem; }
        .sub { color: #475569; margin-bottom: 1rem; }
        .card.empty {
          border: 2px solid #c7d2fe; border-radius: 14px; padding: 1.25rem;
          display: grid; gap: .5rem; justify-items: start; background: #fff;
        }
        .icon { border: 2px solid #e2e8f0; border-radius: 12px; padding: .5rem; background: #f8fafc; }
        .btn {
          display: inline-block; padding: .6rem 1rem; border-radius: 12px;
          background: #2563eb; color: #fff; text-decoration: none; box-shadow: 0 4px 0 #1e40af;
        }
        .btn:active { transform: translateY(1px); box-shadow: 0 3px 0 #1e40af; }
      `}</style>
    </main>
  );
}
