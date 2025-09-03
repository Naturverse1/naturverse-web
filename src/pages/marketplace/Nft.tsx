import Breadcrumbs from '../../components/Breadcrumbs';
export default function MarketplaceNft() {
  return (
    <main className="container py-8">
      <Breadcrumbs items={[{label:'Home',href:'/'},{label:'Marketplace',href:'/marketplace'},{label:'NFT'}]} />
      <section className="card mt-4 p-6">
        <h1 className="h1 mb-2">NFT</h1>
        <p className="muted">Coming soon.</p>
      </section>
    </main>
  );
}
