import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type TabKey = "home" | "pick" | "upload" | "generate" | "mint" | "marketplace";
export function NavatarTabs({ active }: { active: TabKey }) {
  const all = [
    { key: "home",        label: "My Navatar", to: "/navatar" },
    { key: "pick",        label: "Pick",        to: "/navatar/pick" },
    { key: "upload",      label: "Upload",      to: "/navatar/upload" },
    { key: "generate",    label: "Generate",    to: "/navatar/generate" },
    { key: "mint",        label: "NFT / Mint",  to: "/navatar/mint" },
    { key: "marketplace", label: "Marketplace", to: "/navatar/marketplace" },
  ] as const;

  const [menuOpen, setMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const activeTab = all.find(t => t.key === active)!;
  const rest = all.filter(t => t.key !== active);

  return (
    <div className="nv-tabs">
      {/* Desktop / tablet: all tabs inline */}
      <div className="nv-tabs-row nv-only-wide">
        {all.map(t => (
          <Link key={t.key} to={t.to} className={`nv-tab ${t.key===active ? "is-active": ""}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* Mobile: only active + More */}
      <div className="nv-tabs-row nv-only-narrow">
        <Link to={activeTab.to} className="nv-tab is-active">{activeTab.label}</Link>
        <div ref={moreRef} className="nv-more">
          <button className="nv-tab" aria-haspopup="menu" onClick={()=>setMenuOpen(v=>!v)}>…</button>
          {menuOpen && (
            <div className="nv-more-menu" role="menu">
              {rest.map(t => (
                <Link role="menuitem" key={t.key} to={t.to} className="nv-more-item">{t.label}</Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
