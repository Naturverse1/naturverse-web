import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { organizationLd, websiteLd } from './lib/jsonld';
import { CartProvider } from './lib/cart';

export default function App() {
  return (
    <CartProvider>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <main id="main">
          <div className="container">
            <RouterProvider router={router} />
          </div>
        </main>
      </>
    </CartProvider>
  );
}
