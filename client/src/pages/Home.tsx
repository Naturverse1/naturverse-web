import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to the map page
    if (user && !loading) {
      navigate('/map');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen magic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen magic-gradient">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-fredoka text-white mb-6 animate-fade-in" data-testid="text-welcome">
            🌿 Welcome to The Naturverse
          </h1>
          <p className="text-white/90 text-xl mb-8 animate-fade-in-delay">
            Your gateway to magical learning adventures awaits. Discover the wonders of nature through interactive stories, games, and enchanting experiences.
          </p>
          
          {/* Call to Action for New Users */}
          <div className="mb-12 animate-fade-in-delay">
            <Link to="/signup">
              <Button className="bg-nature hover:bg-forest text-white text-lg px-8 py-4 mr-4" data-testid="button-get-started">
                ✨ Start Your Adventure
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forest text-lg px-8 py-4" data-testid="button-sign-in">
                🚀 Sign In
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center space-x-4 animate-fade-in-delay-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-xs">
              <div className="text-4xl mb-2">🌟</div>
              <h3 className="text-white font-bold text-lg mb-2">Magical Stories</h3>
              <p className="text-white/80 text-sm">Embark on adventures with nature's most fascinating creatures</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-xs">
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="text-white font-bold text-lg mb-2">Interactive Games</h3>
              <p className="text-white/80 text-sm">Learn through play with engaging educational activities</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-xs">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-white font-bold text-lg mb-2">Virtual Expeditions</h3>
              <p className="text-white/80 text-sm">Explore ecosystems from around the world</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}