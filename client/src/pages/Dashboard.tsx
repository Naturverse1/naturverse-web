export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4" data-testid="text-welcome">
            Welcome to the Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Your personalized dashboard is ready for you.
          </p>
        </div>
      </div>
    </div>
  );
}