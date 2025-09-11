import { NavPills } from './_shared/NavPills';
import { CardFrame } from './_shared/CardFrame';

export default function MarketplaceStub() {
  return (
    <main className="container">
      <ol className="breadcrumb">
        <li>
          <a href="/">Home</a>
        </li>
        <li>/ Navatar</li>
        <li>/ Marketplace</li>
      </ol>
      <h1>Marketplace (Coming Soon)</h1>
      <NavPills active="Marketplace" />
      <div className="grid center">
        <CardFrame>
          <div className="placeholder" />
        </CardFrame>
        <CardFrame>
          <div className="placeholder" />
        </CardFrame>
      </div>
      <p className="muted center">Mockups and merch generator preview will appear here.</p>
    </main>
  );
}
