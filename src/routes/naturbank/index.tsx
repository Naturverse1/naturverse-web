import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";

export default function Naturbank() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Naturbank</h2>
      <HubGrid>
        <HubCard title="Wallet"      desc="Create custodial wallet & view address." emoji="🪙" />
        <HubCard title="NATUR Token" desc="Earnings, redemptions, and ledger."      emoji="🪙" />
        <HubCard title="NFTs"        desc="Mint navatar cards & collectibles."      emoji="🖼️" />
        <HubCard title="Learn"       desc="Crypto basics & safety guides."          emoji="📘" />
      </HubGrid>
    </section>
  );
}
