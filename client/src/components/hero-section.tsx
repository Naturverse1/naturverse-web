import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartExploring: () => void;
}

export function HeroSection({ onStartExploring }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen relative gradient-bg flex items-center justify-center">
      {/* Nature background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=1200')"
        }}
      />
      
      {/* Floating magical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-8 h-8 bg-sunny rounded-full opacity-70"></div>
        <div className="floating-element absolute top-40 right-20 w-6 h-6 bg-coral rounded-full opacity-60"></div>
        <div className="floating-element absolute top-60 left-1/4 w-4 h-4 bg-turquoise rounded-full opacity-80"></div>
        <div className="floating-element absolute bottom-40 right-1/3 w-10 h-10 bg-magic rounded-full opacity-50"></div>
        <div className="floating-element absolute bottom-60 left-1/2 w-5 h-5 bg-sunny rounded-full opacity-70"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8" data-testid="logo-container">
          <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300">
            <h1 className="font-fredoka text-5xl md:text-7xl lg:text-8xl text-forest mb-2" data-testid="text-logo">
              The Naturverse
            </h1>
            <div className="w-full h-2 magic-gradient rounded-full"></div>
          </div>
        </div>

        {/* Magical Tagline */}
        <div className="mb-12" data-testid="tagline-container">
          <h2 className="font-fredoka text-2xl md:text-4xl lg:text-5xl text-white mb-4 drop-shadow-lg" data-testid="text-tagline">
            <span className="text-gradient">✨ A Magical World of Learning ✨</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium" data-testid="text-description">
            Embark on an extraordinary journey through nature where every discovery sparks curiosity and every adventure builds knowledge!
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-16" data-testid="cta-container">
          <Button
            onClick={onStartExploring}
            data-testid="button-start-exploring"
            className="group relative inline-flex items-center px-12 py-6 text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-coral via-magic to-turquoise rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-coral/50 border-0"
          >
            <span className="relative z-10 font-fredoka">🚀 Start Exploring</span>
            <div className="absolute inset-0 bg-gradient-to-r from-turquoise via-sunny to-coral rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce-gentle" data-testid="scroll-indicator">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full mx-auto relative">
            <div className="w-2 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse-slow"></div>
          </div>
          <p className="text-white/70 text-sm mt-2 font-medium">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
