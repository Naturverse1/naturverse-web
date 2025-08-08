import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TurianLogo from "@assets/turian_media_logo_transparent.png";

export default function Home() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect authenticated users to the map page
    if (user && !loading) {
      setLocation('/map');
    }
  }, [user, loading, setLocation]);

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

  // Clean modern landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-white">
      {/* Hero Section */}
      <section className="hero-section pt-20 pb-16 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8 relative inline-block">
            <img 
              src={TurianLogo} 
              alt="The Naturverse" 
              className="w-24 h-24 mx-auto drop-shadow-xl"
            />
            <div className="absolute -top-2 -right-2 text-2xl animate-sparkle-twinkle">✨</div>
          </div>
          
          <h1 className="text-display text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Welcome to The Naturverse™
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A magical world of learning and adventure!
          </p>
          
          <Button asChild className="btn-primary text-lg px-8 py-3">
            <Link to="/login">
              <span className="mr-2">🚀</span>
              Start Exploring
            </Link>
          </Button>
        </div>
      </section>

      {/* Character Guides Section */}
      <section className="py-16 px-6 education-section">
        <div className="container mx-auto">
          <h2 className="text-display text-4xl font-bold text-center mb-4 text-green-800">
            🌟 Meet Your Magical Guides
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Your friendly companions will guide you through every magical adventure in The Naturverse™!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🧙‍♂️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Turian</h3>
              <p className="text-gray-600">Your Primary Guide & Wise Forest Guardian</p>
            </div>
            
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🐸</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Frankie Frogs</h3>
              <p className="text-gray-600">The adventurous explorer</p>
            </div>
            
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Non Bua</h3>
              <p className="text-gray-600">The magical storyteller</p>
            </div>
            
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Inkie</h3>
              <p className="text-gray-600">The creative artist</p>
            </div>
            
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🦋</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Blue Butterfly</h3>
              <p className="text-gray-600">The gentle guide</p>
            </div>
            
            <div className="character-card text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Tommy Tuk Tuk</h3>
              <p className="text-gray-600">The island adventurer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Sections */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-display text-4xl font-bold text-center mb-4 text-green-800">
            📚 What You'll Learn
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Magical adventures that make learning fun, engaging, and memorable!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="learning-card text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Languages</h3>
              <p className="text-gray-600">Learn languages through fun stories and interactive conversations with magical creatures!</p>
            </div>
            
            <div className="learning-card text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold mb-2">Nature</h3>
              <p className="text-gray-600">Discover plants, animals, and ecosystems in our enchanted nature adventures!</p>
            </div>
            
            <div className="learning-card text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">Geography</h3>
              <p className="text-gray-600">Explore continents, countries, and landmarks on magical map quests!</p>
            </div>
            
            <div className="learning-card text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Crypto Safety</h3>
              <p className="text-gray-600">Learn digital safety and responsible Web3 practices in age-appropriate ways!</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-16 px-6 bg-green-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-display text-4xl font-bold text-center mb-4 text-green-800">
            👪 For Parents
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            100% kid-safe. COPPA compliant. Optional crypto wallet with parental control.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">100% Kid-Safe</h3>
              <p className="text-gray-600">Carefully curated content with no inappropriate material</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold mb-2">COPPA Compliant</h3>
              <p className="text-gray-600">Full compliance with children's privacy protection laws</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Parental Control</h3>
              <p className="text-gray-600">Optional crypto wallet with complete parental oversight</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-display text-3xl font-bold mb-4">Ready to start your magical learning journey?</h2>
          <Button asChild className="btn-primary text-lg px-8 py-3">
            <Link to="/signup">
              <span className="mr-2">🎓</span>
              Join The Adventure
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}