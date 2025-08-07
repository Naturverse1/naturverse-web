import { Button } from "@/components/ui/button";
// Assets will be re-uploaded

interface HeroSectionProps {
  onStartExploring: () => void;
}

export function HeroSection({ onStartExploring }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen relative bg-gradient-to-br from-purple-900 via-blue-900 to-emerald-900 flex items-center justify-center overflow-hidden">
      {/* Glowing background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
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
      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        {/* Logo with enhanced branding */}
        <div className="text-center mb-12 animate-fade-in" data-testid="logo-container">
          <div className="inline-block relative">
            {/* Glowing background for logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse scale-110"></div>
            <div className="relative z-10 w-56 h-56 md:w-72 md:h-72 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              data-testid="logo-placeholder">
              <div className="text-6xl md:text-8xl">🌿</div>
            </div>
            {/* Magical sparkles around logo */}
            <div className="absolute top-4 left-4 text-yellow-300 text-2xl animate-ping">✨</div>
            <div className="absolute top-8 right-8 text-pink-300 text-xl animate-ping" style={{ animationDelay: '1s' }}>🌟</div>
            <div className="absolute bottom-8 left-8 text-blue-300 text-lg animate-ping" style={{ animationDelay: '2s' }}>💫</div>
          </div>
        </div>

        {/* Main content with characters */}
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left character - Turian (Primary Guide) */}
          <div className="hidden lg:block animate-fade-in-delay" data-testid="turian-character">
            <div className="text-center relative">
              {/* Special glow for Turian as main character */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-2xl animate-pulse scale-110"></div>
              <div className="relative z-10 w-64 h-80 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl shadow-2xl border-4 border-cyan-400/50 mb-4 hover:scale-105 transition-transform duration-500 hover:shadow-cyan-400/70 flex items-center justify-center">
                <div className="text-8xl">🧙‍♂️</div>
              </div>
              <div className="relative z-10">
                <p className="text-white font-bold text-xl mb-1">Meet Turian!</p>
                <p className="text-cyan-300 text-sm font-medium">🧙‍♂️ Your Wise Forest Guardian</p>
              </div>
              {/* Crown icon to show Turian is the main guide */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-2xl animate-bounce">👑</div>
            </div>
          </div>

          {/* Center content */}
          <div className="text-center animate-fade-in-delay" data-testid="main-content">
            <h1 className="font-fredoka text-4xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-2xl" data-testid="text-headline">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Welcome to The Naturverse™
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-12 font-medium drop-shadow-lg" data-testid="text-subheadline">
              A magical world of learning and adventure!
            </p>
            
            {/* Start Exploring Button */}
            <Button
              onClick={onStartExploring}
              data-testid="button-start-exploring"
              className="group relative inline-flex items-center px-16 py-8 text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-500 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 border-0 animate-pulse-glow"
            >
              <span className="relative z-10 font-fredoka drop-shadow-lg">🚀 Start Exploring</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            </Button>
          </div>

          {/* Right character - Franko */}
          <div className="hidden lg:block animate-fade-in-delay-2" data-testid="franko-character">
            <div className="text-center">
              <div className="w-64 h-80 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-2xl border-4 border-white/30 mb-4 hover:scale-105 transition-transform duration-500 hover:shadow-green-400/50 flex items-center justify-center">
                <div className="text-8xl">🐸</div>
              </div>
              <p className="text-white/80 font-medium text-xl">Meet Franko!</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-16 animate-bounce-gentle opacity-80" data-testid="scroll-indicator">
          <div className="w-10 h-16 border-3 border-white/70 rounded-full mx-auto relative backdrop-blur-sm bg-white/10">
            <div className="w-3 h-4 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full mx-auto mt-3 animate-pulse-slow shadow-lg"></div>
          </div>
          <p className="text-white/80 text-lg mt-3 font-medium drop-shadow-lg">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
