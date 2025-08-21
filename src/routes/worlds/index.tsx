import HubCard from '../../components/HubCard';
import HubGrid from '../../components/HubGrid';

const WORLDS = [
  { to: '/worlds/thailandia', emoji: '🐘🌸', title: 'Thailandia', sub: 'Coconuts & Elephants' },
  { to: '/worlds/brazilandia', emoji: '🍌🦜', title: 'Brazilandia', sub: 'Bananas & Parrots' },
  { to: '/worlds/indilandia', emoji: '🥭🐯', title: 'Indilandia', sub: 'Mangoes & Tigers' },
  { to: '/worlds/amerilandia', emoji: '🍎🦅', title: 'Amerilandia', sub: 'Apples & Eagles' },
  { to: '/worlds/australandia', emoji: '🍑🦘', title: 'Australandia', sub: 'Peaches & Kangaroos' },
  { to: '/worlds/chilandia', emoji: '🎋🐼', title: 'Chilandia', sub: 'Bamboo (shoots) & Pandas' },
  { to: '/worlds/japonica', emoji: '🌸🦊', title: 'Japonica', sub: 'Cherry Blossoms & Foxes' },
  { to: '/worlds/africania', emoji: '🦁🌞', title: 'Africania', sub: 'Mangoes & Lions' },
  { to: '/worlds/europalia', emoji: '🌻🦔', title: 'Europalia', sub: 'Sunflowers & Hedgehogs' },
  { to: '/worlds/britannula', emoji: '🌹🦔', title: 'Britannula', sub: 'Roses & Hedgehogs' },
  { to: '/worlds/kiwilandia', emoji: '🥝🐑', title: 'Kiwilandia', sub: 'Kiwis & Sheep' },
  { to: '/worlds/madagascaria', emoji: '🍋🦥', title: 'Madagascaria', sub: 'Lemons & Lemurs' },
  { to: '/worlds/greenlandia', emoji: '🧊🐻‍❄️', title: 'Greenlandia', sub: 'Ice & Polar Bears' },
  {
    to: '/worlds/antarcticland',
    emoji: '❄️🐧',
    title: 'Antarcticland',
    sub: 'Ice Crystals & Penguins',
  },
];

export default function Worlds() {
  return (
    <main className="container">
      <div className="breadcrumb">Home / Worlds</div>
      <h2 className="section-title">Worlds</h2>
      <p className="section-lead">Explore the 14 kingdoms.</p>

      <HubGrid>
        {WORLDS.map((w) => (
          <HubCard key={w.title} to={w.to} emoji={w.emoji} title={w.title} sub={w.sub} />
        ))}
      </HubGrid>
    </main>
  );
}
