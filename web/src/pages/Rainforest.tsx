import { Link } from 'react-router-dom';

export default function Rainforest() {
  const cards = [
    { title: 'Plants', emoji: '🌱', description: 'Learn about rainforest plants', href: '/rainforest/plants' },
    { title: 'Animals', emoji: '🐒', description: 'Meet amazing animals', href: '/rainforest/animals' },
    { title: 'Ecosystem', emoji: '🌳', description: 'Explore how everything works together', href: '/rainforest/ecosystem' },
    { title: 'Quizzes', emoji: '🧠', description: 'Test your rainforest knowledge', href: '/rainforest/quiz' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-500 text-white">
      <header className="p-4">
        <Link to="/" className="underline">Back to Home</Link>
      </header>
      <main className="flex flex-col items-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mt-2">Tropical Rainforest</h1>
        <p className="mt-2 text-center text-lg">Discover amazing plants and animals with Turian!</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {cards.map(card => (
            <div key={card.title} className="bg-white text-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition hover:scale-105">
              <div className="text-4xl mb-2">{card.emoji}</div>
              <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
              <p className="mb-4">{card.description}</p>
              <Link to={card.href} className="cta">Start</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

