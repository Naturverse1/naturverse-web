import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartExploring: () => void;
}

export function HeroSection({ onStartExploring }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center overflow-hidden">
      {/* Enchanted jungle background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Magical floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
        <div className="floating-element absolute top-40 right-20 w-2 h-2 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="floating-element absolute top-60 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-80 animate-pulse"></div>
        <div className="floating-element absolute bottom-40 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="floating-element absolute bottom-60 left-1/2 w-2 h-2 bg-green-400 rounded-full opacity-80 animate-pulse"></div>
        <div className="floating-element absolute top-32 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="floating-element absolute bottom-32 left-1/4 w-4 h-4 bg-cyan-400 rounded-full opacity-80 animate-pulse"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo placeholder - will be replaced with uploaded logo */}
        <div className="mb-8 animate-fade-in" data-testid="logo-container">
          <div className="inline-block p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 border-4 border-yellow-400/30">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-4">
              <div className="text-white text-center">
                <div className="text-sm font-medium mb-2">Upload your logo to:</div>
                <div className="font-mono text-xs bg-black/20 rounded px-2 py-1">client/src/assets/naturverse-logo.png</div>
              </div>
            </div>
            <h1 className="font-fredoka text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2" data-testid="text-logo">
              The Naturverse™
            </h1>
            <div className="w-full h-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Magical Tagline */}
        <div className="mb-12 animate-fade-in-delay" data-testid="tagline-container">
          <h2 className="font-fredoka text-3xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-2xl" data-testid="text-tagline">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">✨ A Magical World of Learning ✨</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg" data-testid="text-description">
            Embark on an extraordinary journey through nature where every discovery sparks curiosity and every adventure builds knowledge!
          </p>
        </div>

        {/* Glowing CTA Button */}
        <div className="mb-16 animate-fade-in-delay-2" data-testid="cta-container">
          <Button
            onClick={onStartExploring}
            data-testid="button-start-exploring"
            className="group relative inline-flex items-center px-16 py-8 text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-500 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 border-0 animate-pulse-glow"
          >
            <span className="relative z-10 font-fredoka drop-shadow-lg">🌟 Start Exploring</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce-gentle opacity-80" data-testid="scroll-indicator">
          <div className="w-10 h-16 border-3 border-white/70 rounded-full mx-auto relative backdrop-blur-sm bg-white/10">
            <div className="w-3 h-4 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full mx-auto mt-3 animate-pulse-slow shadow-lg"></div>
          </div>
          <p className="text-white/80 text-lg mt-3 font-medium drop-shadow-lg">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
