import { Link } from 'wouter';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-800 mb-4" data-testid="text-404">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6" data-testid="text-not-found">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button data-testid="button-home">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
