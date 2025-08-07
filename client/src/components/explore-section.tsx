import { Button } from "@/components/ui/button";

export function ExploreSection() {
  const features = [
    {
      id: "stories",
      icon: "📚",
      title: "Interactive Stories",
      description: "Immerse yourself in magical tales where you're the hero of every adventure!",
      color: "nature",
      buttonText: "Explore Stories →"
    },
    {
      id: "games",
      icon: "🎮",
      title: "Nature Games",
      description: "Learn through fun games about animals, plants, and the amazing world around us!",
      color: "coral",
      buttonText: "Play Games →"
    },
    {
      id: "expeditions",
      icon: "🔍",
      title: "Virtual Expeditions",
      description: "Go on virtual field trips to rainforests, oceans, and magical places!",
      color: "magic",
      buttonText: "Start Exploring →"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'nature':
        return { border: 'border-nature', text: 'text-nature', hover: 'hover:text-forest' };
      case 'coral':
        return { border: 'border-coral', text: 'text-coral', hover: 'hover:text-red-600' };
      case 'magic':
        return { border: 'border-magic', text: 'text-magic', hover: 'hover:text-purple-800' };
      default:
        return { border: 'border-nature', text: 'text-nature', hover: 'hover:text-forest' };
    }
  };

  return (
    <section id="explore" className="min-h-screen bg-gradient-to-br from-white to-turquoise/10 py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16" data-testid="section-header">
          <h2 className="font-fredoka text-4xl md:text-6xl text-forest mb-6" data-testid="text-section-title">
            🌿 Discover Amazing Adventures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="text-section-description">
            Join millions of young explorers on magical learning journeys through interactive stories, games, and discoveries!
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" data-testid="features-grid">
          {features.map((feature) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={feature.id}
                className={`group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 ${colorClasses.border}`}
                data-testid={`card-${feature.id}`}
              >
                <div className="text-6xl mb-4" data-testid={`icon-${feature.id}`}>{feature.icon}</div>
                <h3 className="font-fredoka text-2xl text-forest mb-4" data-testid={`title-${feature.id}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed" data-testid={`description-${feature.id}`}>
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button 
                    className={`${colorClasses.text} font-semibold ${colorClasses.hover} transition-colors`}
                    data-testid={`button-${feature.id}`}
                  >
                    {feature.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action section */}
        <div className="text-center bg-gradient-to-r from-nature to-forest rounded-3xl p-12 text-white" data-testid="cta-section">
          <h3 className="font-fredoka text-3xl md:text-4xl mb-6" data-testid="text-cta-title">
            Ready to Begin Your Adventure?
          </h3>
          <p className="text-xl mb-8 opacity-90" data-testid="text-cta-description">
            Join thousands of young explorers already discovering the wonders of nature!
          </p>
          <Button
            className="inline-flex items-center px-10 py-4 bg-white text-forest font-bold text-lg rounded-full hover:bg-sunny transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0"
            data-testid="button-get-started"
          >
            <span className="font-fredoka">🌟 Get Started Free</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
