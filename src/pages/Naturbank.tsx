import Page from "../components/Page";
import { Link } from "react-router-dom";

export default function Naturbank() {
  return (
    <Page title="Naturbank" subtitle="Wallet, token, and collectibles.">
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
        <Card to="/naturbank/wallet" title="Wallet" desc="Create custodial wallet & view address." icon="🪪" />
        <Card to="/naturbank/token" title="NATUR Token" desc="Earnings, redemptions, and ledger." icon="🪙" />
        <Card to="/naturbank/nfts" title="NFTs" desc="Mint navatar cards & collectibles." icon="🖼️" />
        <Card to="/naturbank/learn" title="Learn" desc="Crypto basics & safety guides." icon="📘" />
      </div>
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

