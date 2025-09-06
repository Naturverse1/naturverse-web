import { Link, useLocation } from "react-router-dom";

function clsx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type TabKey = "home" | "card" | "pick" | "upload" | "gen" | "market";

function Pill({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={clsx("pill", active && "pill--active")}
    >
      {children}
    </Link>
  );
}

export function NavTabs({ active }: { active: TabKey }) {
  const { pathname } = useLocation();
  const isHubHome = pathname === "/navatar";
  return (
    <nav className={clsx("nv-tabs", !isHubHome && "nv-tabs--hiddenMobile")}> 
      <Pill to="/navatar" active={active === "home"}>My Navatar</Pill>
      <Pill to="/navatar/card" active={active === "card"}>Card</Pill>
      <Pill to="/navatar/pick" active={active === "pick"}>Pick</Pill>
      <Pill to="/navatar/upload" active={active === "upload"}>Upload</Pill>
      <Pill to="/navatar/generate" active={active === "gen"}>Generate</Pill>
      <Pill to="/navatar/marketplace" active={active === "market"}>Marketplace</Pill>
    </nav>
  );
}
export default NavTabs;
