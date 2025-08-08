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
    <div className="min-h-screen magic-gradient relative overflow-hidden">
      {/* Floating magical elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-10 text-4xl animate-sparkle">✨</div>
        <div className="floating-element absolute top-32 right-20 text-3xl animate-sparkle">🌟</div>
        <div className="floating-element absolute bottom-40 left-20 text-5xl animate-sparkle">🦋</div>
        <div className="floating-element absolute bottom-20 right-10 text-4xl animate-sparkle">🌸</div>
        <div className="floating-element absolute top-60 left-1/4 text-3xl animate-sparkle">🍃</div>
        <div className="floating-element absolute bottom-60 right-1/4 text-4xl animate-sparkle">🌺</div>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl font-fredoka text-white mb-6 animate-bounce-in text-gradient-rainbow" data-testid="text-welcome">
            🌿 Welcome to The Naturverse
          </h1>
          <p className="text-white/90 text-xl mb-8 animate-fade-in-delay magical-shadow">
            ✨ Your gateway to magical learning adventures awaits! ✨<br/>
            Discover the wonders of nature through interactive stories, games, and enchanting experiences.
          </p>
          
          {/* Call to Action for New Users */}
          <div className="mb-12 animate-fade-in-delay">
            <Link to="/signup">
              <Button className="kid-friendly-button text-xl px-10 py-5 mr-6 animate-bounce-gentle" data-testid="button-get-started">
                ✨ Start Your Adventure ✨
              </Button>
            </Link>
            <Link to="/login">
              <Button className="kid-friendly-button bg-turquoise hover:bg-teal-500 text-xl px-10 py-5 animate-bounce-gentle" data-testid="button-sign-in">
                🚀 Sign In 🚀
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center space-x-6 animate-fade-in-delay-2">
            <div className="kid-friendly-card p-8 max-w-xs hover-wiggle">
              <div className="text-6xl mb-4 animate-bounce-gentle">🌟</div>
              <h3 className="text-magic font-fredoka text-xl mb-3">Magical Stories</h3>
              <p className="text-forest/80 text-sm">Embark on adventures with nature's most fascinating creatures and discover ancient secrets!</p>
            </div>
            <div className="kid-friendly-card p-8 max-w-xs hover-wiggle">
              <div className="text-6xl mb-4 animate-bounce-gentle">🎮</div>
              <h3 className="text-turquoise font-fredoka text-xl mb-3">Interactive Games</h3>
              <p className="text-forest/80 text-sm">Learn through play with engaging educational activities that make learning super fun!</p>
            </div>
            <div className="kid-friendly-card p-8 max-w-xs hover-wiggle">
              <div className="text-6xl mb-4 animate-bounce-gentle">🌍</div>
              <h3 className="text-coral font-fredoka text-xl mb-3">Virtual Expeditions</h3>
              <p className="text-forest/80 text-sm">Explore amazing ecosystems from around the world and meet incredible wildlife!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}