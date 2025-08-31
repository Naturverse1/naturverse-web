import HubCard from '../../components/HubCard';
import HubGrid from '../../components/HubGrid';

export default function Naturbank() {
  return (
    <section className="space-y-6 naturbank-page">
      <h2 className="text-2xl font-bold">Naturbank</h2>
      <HubGrid>
        <HubCard hub={{ href: "/naturbank/wallet", image: "/logo.png", name: "Wallet", subtitle: "Create custodial wallet & view address." }} />
        <HubCard hub={{ href: "/naturbank/token", image: "/logo.png", name: "NATUR Token", subtitle: "Earnings, redemptions, and ledger." }} />
        <HubCard hub={{ href: "/naturbank/nfts", image: "/logo.png", name: "NFTs", subtitle: "Mint navatar cards & collectibles." }} />
        <HubCard hub={{ href: "/naturbank/learn", image: "/logo.png", name: "Learn", subtitle: "Crypto basics & safety guides." }} />
      </HubGrid>
      <p className="text-sm text-gray-500 mt-2">Demo address (placeholder) shown in Wallet.</p>
    </section>
  );
}
