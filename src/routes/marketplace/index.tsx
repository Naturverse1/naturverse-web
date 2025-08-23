import Page from "../../components/Page";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonGrid from "../../components/SkeletonGrid";

export default function Marketplace() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);
  return (
    <Page title="Marketplace" subtitle="Shop creations and merch.">
      {ready ? (
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
        <Card to="/marketplace/catalog" title="Catalog" desc="Browse items." icon="📦" />
        <Card to="/marketplace/wishlist" title="Wishlist" desc="Your favorites." icon="❤️" />
        <Card to="/marketplace/checkout" title="Checkout" desc="Pay & ship." icon="🧾" />
      </div>
      ) : (
        <SkeletonGrid count={3} />
      )}
    </Page>
  );
}

function Card({ to, title, desc, icon }:{to:string; title:string; desc:string; icon:string}) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="text-lg font-semibold flex items-center gap-2"><span>{icon}</span>{title}</div>
      <p className="mt-1 text-slate-600">{desc}</p>
    </Link>
  );
}

