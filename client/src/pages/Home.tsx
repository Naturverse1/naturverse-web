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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint via-background to-sage/5 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-emerald/20 text-4xl animate-subtle-float">🌿</div>
        <div className="absolute top-32 right-20 text-forest/20 text-3xl animate-subtle-float stagger-1">🍃</div>
        <div className="absolute bottom-40 left-20 text-ocean/20 text-2xl animate-subtle-float stagger-2">🌊</div>
        <div className="absolute bottom-20 right-10 text-emerald/20 text-3xl animate-subtle-float stagger-3">🌱</div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display text-foreground mb-6 animate-fade-in" data-testid="text-welcome">
            <span className="text-emerald">🌿</span> Welcome to <span className="text-gradient">Naturverse</span>
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl mb-12 animate-fade-in stagger-1 text-balance leading-relaxed">
            Discover the wonders of nature through interactive stories, immersive expeditions, and educational adventures designed to inspire young minds.
          </p>
          
          {/* Call to Action for New Users */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in stagger-2">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-4 hover-lift">
              <Link to="/signup" data-testid="button-get-started">
                <span className="mr-2">✨</span>Start Your Journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-outline text-lg px-8 py-4 hover-lift">
              <Link to="/login" data-testid="button-sign-in">
                <span className="mr-2">🚀</span>Sign In
              </Link>
            </Button>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-auto-fit gap-8 animate-fade-in stagger-3">
            <div className="modern-card-interactive p-8 text-center group">
              <div className="text-5xl mb-6 animate-gentle-pulse group-hover:scale-110 transition-transform duration-300">📖</div>
              <h3 className="text-emerald font-display text-xl mb-4">Interactive Stories</h3>
              <p className="text-muted-foreground leading-relaxed">Embark on captivating adventures with nature's most fascinating creatures and uncover the secrets of our natural world.</p>
            </div>
            <div className="modern-card-interactive p-8 text-center group">
              <div className="text-5xl mb-6 animate-gentle-pulse group-hover:scale-110 transition-transform duration-300">🎮</div>
              <h3 className="text-ocean font-display text-xl mb-4">Educational Games</h3>
              <p className="text-muted-foreground leading-relaxed">Learn through engaging play with interactive activities designed to make environmental education both fun and memorable.</p>
            </div>
            <div className="modern-card-interactive p-8 text-center group">
              <div className="text-5xl mb-6 animate-gentle-pulse group-hover:scale-110 transition-transform duration-300">🌍</div>
              <h3 className="text-forest font-display text-xl mb-4">Virtual Expeditions</h3>
              <p className="text-muted-foreground leading-relaxed">Explore diverse ecosystems from around the globe and discover the incredible wildlife that calls them home.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}