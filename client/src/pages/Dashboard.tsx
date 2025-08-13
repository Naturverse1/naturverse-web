import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4" data-testid="text-welcome">
            Welcome, {user?.email}
          </h1>
          <p className="text-gray-600 text-lg">Your personalized dashboard is ready for you.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-semibold text-gray-700 mb-2">Learning Progress</h3>
                <p className="text-gray-500 text-sm">Track your educational journey</p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="font-semibold text-gray-700 mb-2">Interactive Games</h3>
                <p className="text-gray-500 text-sm">Fun learning activities</p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="font-semibold text-gray-700 mb-2">Virtual Expeditions</h3>
                <p className="text-gray-500 text-sm">Explore the world virtually</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
