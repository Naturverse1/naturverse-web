export function LearningSection() {
  const learningAreas = [
    {
      id: 'languages',
      icon: '🌍',
      title: 'Languages',
      description:
        'Learn languages through fun stories and interactive conversations with magical creatures!',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'nature',
      icon: '🌿',
      title: 'Nature',
      description: 'Discover plants, animals, and ecosystems in our enchanted nature adventures!',
      color: 'from-sky-500 to-blue-500',
    },
    {
      id: 'geography',
      icon: '🗺️',
      title: 'Geography',
      description: 'Explore continents, countries, and landmarks on magical map quests!',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'crypto-safety',
      icon: '🛡️',
      title: 'Crypto Safety',
      description: 'Learn digital safety and responsible Web3 practices in age-appropriate ways!',
      color: 'from-cyan-500 to-sky-500',
    },
  ];

  return (
    <section
      id="learning"
      className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-sky-900 py-20 relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-40 right-1/3 w-3 h-3 bg-sky-400 rounded-full animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-60 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-40 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-ping"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in" data-testid="learning-header">
          <h2
            className="font-fredoka text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl"
            data-testid="text-learning-title"
          >
            <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              📚 What You'll Learn
            </span>
          </h2>
          <p
            className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg mb-6"
            data-testid="text-learning-description"
          >
            Magical adventures that make learning fun, engaging, and memorable!
          </p>
          <div className="text-sky-300 text-lg font-medium">
            <span className="inline-flex items-center gap-2">
              🧙‍♂️ <span>Guided by Turian and The Naturverse™ Team</span>
            </span>
          </div>
        </div>

        {/* Learning areas grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="learning-grid">
          {learningAreas.map((area, index) => (
            <div
              key={area.id}
              className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:-translate-y-6 border border-white/20 hover:border-white/40 animate-fade-in-stagger"
              style={{ animationDelay: `${index * 0.15}s` }}
              data-testid={`card-${area.id}`}
            >
              {/* Icon with gradient background */}
              <div
                className="relative mb-6 group-hover:scale-110 transition-transform duration-500"
                data-testid={`icon-${area.id}`}
              >
                <div
                  className={`w-20 h-20 mx-auto bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 border-white/30`}
                >
                  <span className="filter drop-shadow-lg">{area.icon}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3
                  className="font-fredoka text-2xl text-white mb-4 drop-shadow-lg"
                  data-testid={`title-${area.id}`}
                >
                  {area.title}
                </h3>
                <p
                  className="text-white/80 leading-relaxed text-lg"
                  data-testid={`description-${area.id}`}
                >
                  {area.description}
                </p>
              </div>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${area.color} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}
              ></div>

              {/* Magical particles */}
              <div className="absolute top-4 right-4 text-blue-300 animate-pulse text-sm">✨</div>
              <div
                className="absolute bottom-4 left-4 text-sky-300 animate-pulse text-sm"
                style={{ animationDelay: '1.5s' }}
              >
                🌟
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in-delay-2">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <p className="text-white/90 text-xl font-medium mb-4">
              Ready to start your magical learning journey?
            </p>
            <div className="text-6xl animate-bounce-gentle">🎓✨</div>
          </div>
        </div>
      </div>
    </section>
  );
}
