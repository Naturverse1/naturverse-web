import { NavLink } from "react-router-dom";

export default function MarketTabs() {
  const tab = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "mk-tab" + (isActive ? " is-active" : "")
      }
      end
    >
      {label}
    </NavLink>
  );

  return (
    <div className="mk-tabs">
      {tab("/marketplace", "Shop")}
      {tab("/marketplace/nft", "NFT / Mint")}
      {tab("/marketplace/specials", "Specials")}
      {tab("/marketplace/wishlist", "Wishlist")}
    </div>
  );
}
