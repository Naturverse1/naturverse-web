import { Link, useLocation } from "react-router-dom";

type Tab = { to: string; label: string };
export default function SectionTabs({ base = "/marketplace" }: { base?: string }) {
  const { pathname } = useLocation();
  const tabs: Tab[] = [
    { to: `${base}`, label: "Shop" },
    { to: `${base}/nft`, label: "NFT / Mint" },
    { to: `${base}/specials`, label: "Specials" },
    { to: `${base}/wishlist`, label: "Wishlist" },
  ];

  return (
    <nav style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",margin:"0 0 1rem"}}>
      {tabs.map(t => {
        const active =
          t.to === "/marketplace"
            ? pathname === "/marketplace"
            : pathname.startsWith(t.to);
        return (
          <Link
            key={t.to}
            to={t.to}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: 8,
              border: "1px solid var(--nv-blue-300)",
              textDecoration: "none",
              color: "var(--nv-blue-700)",
              background: active ? "var(--nv-blue-50)" : "transparent",
              boxShadow: active ? "0 1px 0 rgba(0,0,0,0.04)" : "none",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
