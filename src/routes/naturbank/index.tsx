import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";

export default function Naturbank() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Naturbank</h2>
      <HubGrid>
        <HubCard to="/naturbank/wallet" title="Wallet" desc="Create custodial wallet & view address." emoji="🪙" />
        <HubCard to="/naturbank/token"  title="NATUR Token" desc="Earnings, redemptions, and ledger." emoji="🪙" />
        <HubCard to="/naturbank/nfts"   title="NFTs" desc="Mint navatar cards & collectibles." emoji="🖼️" />
        <HubCard to="/naturbank/learn"  title="Learn" desc="Crypto basics & safety guides." emoji="📘" />
      </HubGrid>
      <p className="text-sm text-gray-500 mt-2">Demo address (placeholder) shown in Wallet.</p>
    </section>
  );
}
