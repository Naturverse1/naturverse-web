import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import storybook reference images
import BookImg from "../assets/book img_1754673794864.jpg";
import CharacterImg from "../assets/Character img_1754673794865.jpg";
import ShroomForestImg from "../assets/Shroom forest_1754673794866.jpg";
import StorybookImg from "../assets/Storybook img_1754673794866.jpg";

// Import character assets
import TurianImg from "../assets/Turian.jpg";
import TurianDurianImg from "../assets/Turian the Durian.png";
import DrPImg from "../assets/Dr P.png";
import FrankieFrogsImg from "../assets/Frankie Frogs.png";
import HankImg from "../assets/hank.png";
import LaoCowImg from "../assets/Lao Cow.png";
import MangoMikeImg from "../assets/Mango Mike.png";
import PineapplePaImg from "../assets/Pineapple Pa-Pa.png";
import BluButterflyImg from "../assets/Blu Butterfly.png";
import TommyTukTukImg from "../assets/Tommy Tuk Tuk.png";
import GuideImg from "../assets/Guide.png";
import JaySingImg from "../assets/Jay-Sing.png";
import InkieImg from "../assets/Inkie.png";
import TwokayImg from "../assets/2kay.png";
import NikkiMTImg from "../assets/Nikki MT.png";
import TurianLogo from "../assets/turian_media_logo_transparent.png";

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

  // Show magical storybook landing page for unauthenticated users
  return (
    <div className="min-h-screen relative overflow-hidden storybook-world">
      {/* Open Book Background with Magical World Emerging */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url(${BookImg})`,
          filter: 'sepia(20%) saturate(120%) hue-rotate(15deg)'
        }}
      />
      
      {/* Enchanted Forest Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${ShroomForestImg})`,
          backgroundPosition: 'center bottom'
        }}
      />
      
      {/* Magical Gradient Overlay */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 50% 20%, rgba(255, 200, 150, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(200, 150, 255, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 60%, rgba(150, 255, 200, 0.25) 0%, transparent 50%),
          linear-gradient(135deg, 
            rgba(255, 240, 200, 0.4) 0%,
            rgba(200, 255, 230, 0.3) 25%,
            rgba(230, 200, 255, 0.3) 50%,
            rgba(255, 220, 200, 0.4) 75%,
            rgba(220, 255, 240, 0.3) 100%
          )
        `,
        animation: 'magical-atmosphere 20s ease-in-out infinite'
      }} />
      
      {/* Floating Magical Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Flying Birds and Butterflies */}
        <div className="absolute top-20 left-10 text-6xl opacity-60 animate-float-cross">🦋</div>
        <div className="absolute top-40 right-20 text-5xl opacity-50 animate-float-cross-reverse">🕊️</div>
        <div className="absolute top-60 left-1/3 text-4xl opacity-70 animate-float-gentle">🦋</div>
        
        {/* Floating Fruits and Nature */}
        <div className="absolute top-32 left-1/4 text-5xl opacity-60 animate-float-bounce">🍎</div>
        <div className="absolute top-80 right-1/3 text-4xl opacity-70 animate-float-bounce-reverse">🍊</div>
        <div className="absolute bottom-60 left-1/6 text-6xl opacity-60 animate-float-gentle">🍌</div>
        <div className="absolute bottom-40 right-1/4 text-5xl opacity-50 animate-float-cross">🥭</div>
        
        {/* Sparkling Magic */}
        <div className="absolute top-24 left-1/2 text-4xl opacity-80 animate-sparkle-dance">✨</div>
        <div className="absolute top-56 right-1/6 text-3xl opacity-90 animate-sparkle-dance stagger-1">⭐</div>
        <div className="absolute bottom-32 left-1/3 text-5xl opacity-70 animate-sparkle-dance stagger-2">🌟</div>
        <div className="absolute bottom-80 right-1/2 text-3xl opacity-80 animate-sparkle-dance stagger-3">✨</div>
        
        {/* Floating Character Silhouettes */}
        <div className="absolute top-1/4 left-8 opacity-40 animate-character-drift">
          <img src={TurianDurianImg} alt="" className="w-16 h-16 object-contain filter drop-shadow-lg" />
        </div>
        <div className="absolute bottom-1/3 right-8 opacity-35 animate-character-drift-reverse">
          <img src={BluButterflyImg} alt="" className="w-14 h-14 object-contain filter drop-shadow-lg" />
        </div>
        <div className="absolute top-1/2 left-1/6 opacity-30 animate-character-float">
          <img src={FrankieFrogsImg} alt="" className="w-12 h-12 object-contain filter drop-shadow-lg" />
        </div>
        <div className="absolute bottom-1/4 right-1/5 opacity-40 animate-character-drift">
          <img src={DrPImg} alt="" className="w-15 h-15 object-contain filter drop-shadow-lg" />
        </div>
      </div>
      
      {/* Magical Storybook Content */}
      <div className="relative z-10">
        {/* Large Centered Naturverse Logo */}
        <div className="text-center pt-16 pb-12 animate-book-opening">
          <div className="relative inline-block">
            <img 
              src={TurianLogo} 
              alt="Naturverse" 
              className="w-40 h-40 mx-auto animate-gentle-pulse drop-shadow-2xl mb-8 hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute -top-4 -left-4 text-4xl animate-sparkle-orbit">✨</div>
            <div className="absolute -top-4 -right-4 text-3xl animate-sparkle-orbit-reverse">🌟</div>
            <div className="absolute -bottom-4 -left-4 text-3xl animate-sparkle-orbit stagger-1">⭐</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-sparkle-orbit-reverse stagger-1">✨</div>
          </div>
        </div>
        
        {/* Magical Storybook Hero Section */}
        <div className="container mx-auto px-6 pb-20 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Storybook Title */}
            <div className="relative mb-12">
              <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 animate-book-opening" data-testid="text-welcome" style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 25%, #FF6347 50%, #FFD700 75%, #32CD32 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}>
                <span className="text-7xl animate-float-bounce inline-block mr-4">📖</span>
                Welcome to Naturverse
                <span className="text-7xl animate-float-bounce inline-block ml-4">🌟</span>
              </h1>
              
              {/* Magical floating elements around title */}
              <div className="absolute -top-8 left-1/4 text-6xl opacity-70 animate-sparkle-dance">✨</div>
              <div className="absolute -top-4 right-1/4 text-5xl opacity-80 animate-sparkle-dance stagger-1">🧚‍♀️</div>
              <div className="absolute -bottom-4 left-1/3 text-4xl opacity-90 animate-sparkle-dance stagger-2">🌈</div>
              <div className="absolute -top-6 left-1/6 text-3xl opacity-70 animate-float-gentle">🦋</div>
              <div className="absolute -bottom-2 right-1/3 text-5xl opacity-60 animate-float-gentle stagger-1">🌺</div>
              <div className="absolute -top-2 right-1/6 text-4xl opacity-80 animate-sparkle-dance stagger-3">⭐</div>
            </div>
            
            <div className="relative mb-16">
              <p className="text-3xl md:text-4xl leading-relaxed font-bold animate-book-opening stagger-1 text-balance" style={{
                color: '#8B4513',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: 'Fredoka, cursive'
              }}>
                <span className="text-5xl animate-float-bounce">🧚‍♀️</span> Step into a <span style={{color: '#9B59B6'}}>magical storybook</span> where 
                nature comes alive! Join <span style={{color: '#27AE60'}}>amazing characters</span>, explore 
                <span style={{color: '#E67E22'}}>enchanted worlds</span>, and discover the 
                <span style={{color: '#F39C12'}}>wonders of our planet</span>! <span className="text-5xl animate-float-bounce">✨</span>
              </p>
              
              {/* Floating characters around description */}
              <div className="absolute -left-12 top-4 animate-character-drift opacity-80">
                <img src={InkieImg} alt="Inkie" className="w-16 h-16 object-contain drop-shadow-xl" />
              </div>
              <div className="absolute -right-12 bottom-4 animate-character-drift-reverse opacity-80">
                <img src={JaySingImg} alt="Jay-Sing" className="w-14 h-14 object-contain drop-shadow-xl" />
              </div>
            </div>
            
            {/* Call to Adventure Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20 animate-book-opening stagger-2">
              <Button asChild size="xxl" className="magical-cta-button text-3xl px-16 py-8 hover-lift shadow-2xl" data-testid="button-get-started">
                <Link to="/signup" className="font-bold" style={{
                  background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)',
                  border: '4px solid rgba(255,255,255,0.3)',
                  borderRadius: '2rem',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                  <span className="text-4xl mr-4 animate-float-bounce">🌟</span>
                  Begin Adventure!
                  <span className="text-4xl ml-4 animate-float-bounce">🦋</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="magical-secondary-button text-2xl px-12 py-6 hover-lift shadow-xl" data-testid="button-sign-in">
                <Link to="/login" className="font-bold" style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '3px solid #9B59B6',
                  borderRadius: '2rem',
                  color: '#9B59B6',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <span className="text-3xl mr-3 animate-sparkle-dance">🚀</span>
                  Return to Magic
                </Link>
              </Button>
            </div>
            
            {/* Character Gallery - Like Trading Cards */}
            <div className="mb-20">
              <h2 className="text-4xl font-bold text-center mb-12 animate-book-opening stagger-2" style={{
                color: '#8B4513',
                fontFamily: 'Fredoka, cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                <span className="text-5xl animate-sparkle-dance">🎭</span> Meet Your Magical Friends <span className="text-5xl animate-sparkle-dance">✨</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {[
                  { img: TurianDurianImg, name: "Turian", role: "Wise Guide", color: "#27AE60", emoji: "🏛️" },
                  { img: DrPImg, name: "Dr P", role: "Science Expert", color: "#3498DB", emoji: "🔬" },
                  { img: FrankieFrogsImg, name: "Frankie", role: "Forest Friend", color: "#9B59B6", emoji: "🐸" },
                  { img: BluButterflyImg, name: "Blu", role: "Sky Dancer", color: "#E74C3C", emoji: "🦋" },
                  { img: MangoMikeImg, name: "Mike", role: "Fruit Master", color: "#F39C12", emoji: "🥭" }
                ].map((character, index) => (
                  <div key={character.name} className="magical-character-card animate-book-opening" style={{
                    animationDelay: `${index * 0.2}s`
                  }}>
                    <div className="relative p-6 text-center transform hover:scale-110 transition-all duration-500 cursor-pointer" style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
                      border: `4px solid ${character.color}40`,
                      borderRadius: '1.5rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}>
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <img 
                          src={character.img} 
                          alt={character.name}
                          className="w-full h-full object-contain drop-shadow-xl rounded-full border-3" 
                          style={{ borderColor: character.color }}
                        />
                        <div className="absolute -top-2 -right-2 text-2xl animate-float-bounce">{character.emoji}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ 
                        color: character.color, 
                        fontFamily: 'Fredoka, cursive',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)' 
                      }}>{character.name}</h3>
                      <p className="text-sm font-medium" style={{ color: '#8B4513' }}>{character.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            {/* Core Adventure Zones - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Enter Thailandia */}
              <Card className="magical-zone-card animate-book-opening stagger-3 transform hover:scale-105 transition-all duration-500 cursor-pointer" data-testid="card-thailandia">
                <div className="relative p-8 text-center" style={{
                  background: 'linear-gradient(145deg, rgba(255,220,200,0.9), rgba(255,200,150,0.8))',
                  borderRadius: '1.5rem',
                  border: '3px solid #F39C12',
                  boxShadow: '0 8px 32px rgba(243,156,18,0.3)'
                }}>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="text-7xl animate-float-bounce">🏛️</div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-dance">✨</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'Fredoka, cursive' }}>Enter Thailandia</h3>
                  <p className="text-lg mb-6" style={{ color: '#A0522D' }}>Explore magical temples and golden lotus fields!</p>
                  <Button className="magical-explore-btn" style={{
                    background: '#F39C12',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span className="text-xl mr-2">🚀</span>Explore
                  </Button>
                </div>
              </Card>

              {/* Create Your Navatar */}
              <Card className="magical-zone-card animate-book-opening stagger-4 transform hover:scale-105 transition-all duration-500 cursor-pointer" data-testid="card-navatar">
                <div className="relative p-8 text-center" style={{
                  background: 'linear-gradient(145deg, rgba(200,150,255,0.9), rgba(180,120,255,0.8))',
                  borderRadius: '1.5rem',
                  border: '3px solid #9B59B6',
                  boxShadow: '0 8px 32px rgba(155,89,182,0.3)'
                }}>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <img src={TurianDurianImg} alt="Avatar" className="w-full h-full object-contain rounded-full border-2 border-white" />
                    <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-dance">🎨</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'Fredoka, cursive' }}>Create Your Navatar</h3>
                  <p className="text-lg mb-6" style={{ color: '#6B4C93' }}>Design your magical nature character!</p>
                  <Button className="magical-explore-btn" style={{
                    background: '#9B59B6',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span className="text-xl mr-2">✨</span>Create
                  </Button>
                </div>
              </Card>

              {/* Explore the Map */}
              <Card className="magical-zone-card animate-book-opening stagger-5 transform hover:scale-105 transition-all duration-500 cursor-pointer" data-testid="card-map">
                <div className="relative p-8 text-center" style={{
                  background: 'linear-gradient(145deg, rgba(150,255,200,0.9), rgba(100,255,150,0.8))',
                  borderRadius: '1.5rem',
                  border: '3px solid #27AE60',
                  boxShadow: '0 8px 32px rgba(39,174,96,0.3)'
                }}>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="text-7xl animate-float-bounce">🗺️</div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-dance">🧭</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'Fredoka, cursive' }}>Explore the Map</h3>
                  <p className="text-lg mb-6" style={{ color: '#196B2A' }}>Journey through enchanted realms!</p>
                  <Button className="magical-explore-btn" style={{
                    background: '#27AE60',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span className="text-xl mr-2">🌟</span>Adventure
                  </Button>
                </div>
              </Card>

              {/* Meet Turian */}
              <Card className="magical-zone-card animate-book-opening stagger-6 transform hover:scale-105 transition-all duration-500 cursor-pointer" data-testid="card-meet-turian">
                <div className="relative p-8 text-center" style={{
                  background: 'linear-gradient(145deg, rgba(255,150,200,0.9), rgba(255,120,180,0.8))',
                  borderRadius: '1.5rem',
                  border: '3px solid #E74C3C',
                  boxShadow: '0 8px 32px rgba(231,76,60,0.3)'
                }}>
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <img src={TurianImg} alt="Turian" className="w-full h-full object-contain rounded-full border-2 border-white" />
                    <div className="absolute -top-2 -right-2 text-3xl animate-sparkle-dance">💬</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'Fredoka, cursive' }}>Meet Turian</h3>
                  <p className="text-lg mb-6" style={{ color: '#B91C2C' }}>Chat with your wise AI guide!</p>
                  <Button className="magical-explore-btn" style={{
                    background: '#E74C3C',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span className="text-xl mr-2">🤝</span>Say Hi
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}