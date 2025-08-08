export default function Home() {
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