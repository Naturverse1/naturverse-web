import Breadcrumbs from '../../components/Breadcrumbs';
export default function MarketplaceSaved() {
  return (
    <main className="container py-8">
      <Breadcrumbs items={[{label:'Home',href:'/'},{label:'Marketplace',href:'/marketplace'},{label:'Saved'}]} />
      <section className="card mt-4 p-6">
        <h1 className="h1 mb-2">Saved</h1>
        <p className="muted">Coming soon.</p>
      </section>
    </main>
  );
}
