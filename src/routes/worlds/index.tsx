import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";

const WORLDS = [
  { title: "Thailandia",   blurb: "Coconuts & Elephants",      emoji: "🐘🪷" },
  { title: "Brazilandia",  blurb: "Bananas & Parrots",         emoji: "🍌🦜" },
  { title: "Indilandia",   blurb: "Mangoes & Tigers",          emoji: "🥭🐯" },
  { title: "Amerilandia",  blurb: "Apples & Eagles",           emoji: "🍎🦅" },
  { title: "Australandia", blurb: "Peaches & Kangaroos",       emoji: "🍑🦘" },
  { title: "Chilandia",    blurb: "Bamboo (shoots) & Pandas",  emoji: "🎍🐼" },
  { title: "Japonica",     blurb: "Cherry Blossoms & Foxes",   emoji: "🌸🦊" },
  { title: "Africania",    blurb: "Mangoes & Lions",           emoji: "🥭🦁" },
  { title: "Europalia",    blurb: "Sunflowers & Hedgehogs",    emoji: "🌻🦔" },
  { title: "Britannula",   blurb: "Roses & Hedgehogs",         emoji: "🌹🦔" },
  { title: "Kiwlandia",    blurb: "Kiwis & Sheep",             emoji: "🥝🐑" },
  { title: "Madagascaria", blurb: "Lemons & Lemurs",           emoji: "🍋🦥" },
  { title: "Greenlandia",  blurb: "Ice & Polar Bears",         emoji: "🧊🐻‍❄️" },
  { title: "Antarcticland",blurb: "Ice Crystals & Penguins",   emoji: "❄️🐧" },
];

export default function Worlds() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Worlds</h2>
      <p className="text-gray-600">Explore the 14 kingdoms.</p>
      <HubGrid>
        {WORLDS.map(w => (
          <HubCard key={w.title} title={w.title} desc={w.blurb} emoji={w.emoji} />
        ))}
      </HubGrid>
      <p className="text-xs text-gray-500 mt-4">Tip: Click any world to view (coming soon).</p>
    </section>
  );
}
