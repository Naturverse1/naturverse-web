import turianImage from "@/assets/turian.png";
import frankoImage from "@/assets/franko.png";
import frannyImage from "@/assets/franny.png";
import inkieImage from "@/assets/inkie.png";
import blueButterfly from "@/assets/blue-butterfly.png";
import coconutCruze from "@/assets/coconut-cruze.png";
import drPDread from "@/assets/dr-p-dread.png";
import fanglings from "@/assets/fanglings.png";
import jaySing from "@/assets/jay-sing.png";
import pineapplePete from "@/assets/pineapple-pete.png";
import slitherkin from "@/assets/slitherkin.png";

export function CharactersSection() {
  const characters = [
    {
      id: "turian",
      name: "Turian",
      image: turianImage,
      description: "🧙‍♂️ Your Primary Guide & Wise Forest Guardian",
      featured: true
    },
    {
      id: "franko", 
      name: "Franko",
      image: frankoImage,
      description: "The adventurous explorer"
    },
    {
      id: "franny",
      name: "Franny",
      image: frannyImage,
      description: "The magical storyteller"
    },
    {
      id: "inkie",
      name: "Inkie",
      image: inkieImage,
      description: "The creative artist"
    },
    {
      id: "blue-butterfly",
      name: "Blue Butterfly",
      image: blueButterfly,
      description: "The gentle guide"
    },
    {
      id: "coconut-cruze",
      name: "Coconut Cruze",
      image: coconutCruze,
      description: "The island adventurer"
    },
    {
      id: "dr-p-dread",
      name: "Dr. P. Dread",
      image: drPDread,
      description: "The nature scientist"
    },
    {
      id: "fanglings",
      name: "Fanglings",
      image: fanglings,
      description: "The playful creatures"
    },
    {
      id: "jay-sing",
      name: "Jay Sing",
      image: jaySing,
      description: "The musical bird"
    },
    {
      id: "pineapple-pete",
      name: "Pineapple Pete",
      image: pineapplePete,
      description: "The tropical friend"
    },
    {
      id: "slitherkin",
      name: "Slitherkin",
      image: slitherkin,
      description: "The wise serpent"
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
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium mb-4" data-testid="text-characters-description">
            Your friendly companions will guide you through every magical adventure in The Naturverse™!
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-3 rounded-full border-2 border-cyan-200">
            <span className="text-cyan-700 font-bold">👑 Turian leads the way!</span>
          </div>
        </div>

        {/* Characters grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="characters-grid">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-4 animate-fade-in-stagger ${
                character.featured 
                  ? 'border-gradient-to-r from-cyan-300 to-blue-300 hover:border-cyan-400 ring-4 ring-cyan-200/50 scale-105' 
                  : 'border-gradient-to-r from-yellow-200 to-pink-200 hover:border-yellow-300'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              data-testid={`card-${character.id}`}
            >
              {/* Character image */}
              <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500" data-testid={`image-${character.id}`}>
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-pink-300/20 rounded-2xl animate-pulse"></div>
              </div>
              
              {/* Character info */}
              <div className="text-center">
                <h3 className="font-fredoka text-2xl bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2" data-testid={`name-${character.id}`}>
                  {character.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" data-testid={`description-${character.id}`}>
                  {character.description}
                </p>
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