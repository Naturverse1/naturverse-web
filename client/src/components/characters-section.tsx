export function CharactersSection() {
  const characters = [
    {
      id: "character1",
      name: "Upload character1.png",
      placeholder: "🧙‍♂️"
    },
    {
      id: "character2", 
      name: "Upload character2.png",
      placeholder: "🦋"
    },
    {
      id: "character3",
      name: "Upload character3.png", 
      placeholder: "🌳"
    },
    {
      id: "character4",
      name: "Upload character4.png",
      placeholder: "🐨"
    }
  ];

  return (
    <section id="characters" className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in" data-testid="characters-header">
          <h2 className="font-fredoka text-5xl md:text-7xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6" data-testid="text-characters-title">
            🌟 Meet Your Magical Guides
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium" data-testid="text-characters-description">
            Your friendly companions will guide you through every magical adventure in The Naturverse!
          </p>
        </div>

        {/* Characters grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="characters-grid">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-4 border-gradient-to-r from-yellow-200 to-pink-200 hover:border-yellow-300 animate-fade-in-stagger"
              style={{ animationDelay: `${index * 0.2}s` }}
              data-testid={`card-${character.id}`}
            >
              {/* Character image placeholder */}
              <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500" data-testid={`image-${character.id}`}>
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-white">
                  <span className="animate-bounce-gentle">{character.placeholder}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-pink-300/20 rounded-full animate-pulse"></div>
              </div>
              
              {/* Upload instruction */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 mb-4">
                  <div className="text-white text-sm font-medium mb-2">Upload to:</div>
                  <div className="font-mono text-xs bg-black/20 rounded px-2 py-1 text-white">
                    client/src/assets/{character.id}.png
                  </div>
                </div>
                <h3 className="font-fredoka text-2xl bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent" data-testid={`name-${character.id}`}>
                  {character.name}
                </h3>
              </div>

              {/* Magical sparkles */}
              <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">✨</div>
              <div className="absolute bottom-4 left-4 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}