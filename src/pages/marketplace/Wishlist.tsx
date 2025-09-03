import Breadcrumbs from '../../components/Breadcrumbs';

export default function WishlistPage() {
  return (
    <main className="container py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Wishlist' },
        ]}
      />
      <section className="card mt-4 p-6">
        <h1 className="h1 mb-4">Wishlist</h1>
        <p className="muted mb-6">Your wishlist is empty.</p>
        {/* TODO: render list of wished items when data exists */}
        <ol className="list-decimal pl-6 space-y-2">
          <li className="text-muted-foreground">Slot 1</li>
          <li className="text-muted-foreground">Slot 2</li>
          <li className="text-muted-foreground">Slot 3</li>
        </ol>
      </section>
    </main>
  );
}
