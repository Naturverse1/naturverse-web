import turianImage from "@/assets/Turian.jpg";
import inkieImage from "@/assets/Inkie.png";
import blueButterfly from "@/assets/Blu Butterfly.png";
import drPImage from "@/assets/Dr P.png";
import pineapplePapa from "@/assets/Pineapple Pa-Pa.png";
import mangoMike from "@/assets/Mango Mike.png";
import slitherkinImage from "@/assets/Slitherkin.png";
import frankieFrogs from "@/assets/Frankie Frogs.png";
import jenSuexImage from "@/assets/Jen-Suex.png";
import tommyTukTuk from "@/assets/Tommy Tuk Tuk.png";
import laoCow from "@/assets/Lao Cow.png";
import jaySing from "@/assets/Jay-Sing.png";
import nonBua from "@/assets/Non-Bua.png";

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
      id: "frankie-frogs", 
      name: "Frankie Frogs",
      image: frankieFrogs,
      description: "The adventurous explorer"
    },
    {
      id: "non-bua",
      name: "Non Bua",
      image: nonBua,
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
      id: "tommy-tuk-tuk",
      name: "Tommy Tuk Tuk",
      image: tommyTukTuk,
      description: "The island adventurer"
    },
    {
      id: "dr-p",
      name: "Dr. P",
      image: drPImage,
      description: "The nature scientist"
    },
    {
      id: "jen-suex",
      name: "Jen Suex",
      image: jenSuexImage,
      description: "The playful creatures"
    },
    {
      id: "jay-sing",
      name: "Jay Sing",
      image: jaySing,
      description: "The musical bird"
    },
    {
      id: "pineapple-pa-pa",
      name: "Pineapple Pa-Pa",
      image: pineapplePapa,
      description: "The wise tropical elder"
    },
    {
      id: "mango-mike",
      name: "Mango Mike",
      image: mangoMike,
      description: "The sweet tropical guardian"
    },
    {
      id: "slitherkin",
      name: "Slitherkin",
      image: slitherkinImage,
      description: "The wise serpent"
    }
  ];

  return (
    <section id="characters" className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-20 relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-sky-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in" data-testid="characters-header">
          <h2 className="font-fredoka text-5xl md:text-7xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent mb-6" data-testid="text-characters-title">
            🌟 Meet Your Magical Guides
          </h2>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium mb-4" data-testid="text-characters-description">
            Your friendly companions will guide you through every magical adventure in The Naturverse™!
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-sky-100 px-6 py-3 rounded-full border-2 border-blue-200">
            <span className="text-blue-700 font-bold">👑 Turian leads the way!</span>
          </div>
        </div>

        {/* Characters grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="characters-grid">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-4 animate-fade-in-stagger ${
                character.featured 
                  ? 'border-gradient-to-r from-blue-300 to-sky-300 hover:border-blue-400 ring-4 ring-blue-200/50 scale-105' 
                  : 'border-gradient-to-r from-blue-200 to-cyan-200 hover:border-blue-300'
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
                <div className={`absolute inset-0 rounded-2xl animate-pulse ${
                  character.id === 'turian' 
                    ? 'bg-gradient-to-br from-blue-300/30 to-sky-300/30' 
                    : 'bg-gradient-to-br from-blue-300/20 to-cyan-300/20'
                }`}></div>
              </div>
              
              {/* Character info */}
              <div className="text-center">
                <h3 className="font-fredoka text-2xl bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-2" data-testid={`name-${character.id}`}>
                  {character.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" data-testid={`description-${character.id}`}>
                  {character.description}
                </p>
              </div>

              {/* Magical sparkles */}
              <div className="absolute top-4 right-4 text-blue-400 animate-pulse">✨</div>
              <div className="absolute bottom-4 left-4 text-sky-400 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}