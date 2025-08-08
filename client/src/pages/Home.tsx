export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4" data-testid="text-welcome">
            Welcome to The Naturverse
          </h1>
          <p className="text-gray-600 text-lg">
            Your gateway to magical learning adventures awaits.
          </p>
        </div>
      </div>
    </div>
  );
}