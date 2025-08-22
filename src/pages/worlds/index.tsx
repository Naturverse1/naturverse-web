import React from "react";

type Kingdom = { name: string; emoji: string; blurb: string; slug: string };

const KINGDOMS: Kingdom[] = [
  { name: "Thailandia",   emoji: "🗺️", blurb: "Coconuts & Elephants", slug: "thailandia" },
  { name: "Brazilandia",  emoji: "🍌", blurb: "Bananas & Parrots", slug: "brazilandia" },
  { name: "Indilandia",   emoji: "🥭", blurb: "Mangoes & Tigers", slug: "indilandia" },
  { name: "Amerilandia",  emoji: "🍎", blurb: "Apples & Eagles", slug: "amerilandia" },
  { name: "Australandia", emoji: "🍑", blurb: "Peaches & Kangaroos", slug: "australandia" },
  { name: "Chilandia",    emoji: "🎍", blurb: "Bamboo (shoots) & Pandas", slug: "chilandia" },
  { name: "Japonica",     emoji: "🌸", blurb: "Cherry Blossoms & Foxes", slug: "japonica" },
  { name: "Africania",    emoji: "🦁", blurb: "Mangoes & Lions", slug: "africania" },
  { name: "Europalia",    emoji: "🌻", blurb: "Sunflowers & Hedgehogs", slug: "europalia" },
  { name: "Britannula",   emoji: "🌹", blurb: "Roses & Hedgehogs", slug: "britannula" },
  { name: "Kiwilandia",   emoji: "🥝", blurb: "Kiwis & Sheep", slug: "kiwilandia" },
  { name: "Madagascaria", emoji: "🍋", blurb: "Lemons & Lemurs", slug: "madagascaria" },
  { name: "Greenlandia",  emoji: "🧊", blurb: "Ice & Polar Bears", slug: "greenlandia" },
  { name: "Antarcticland", emoji: "❄️", blurb: "Ice Crystals & Penguins", slug: "antarcticland" },
];

export default function WorldsIndex() {
  return (
    <div>
      <h1>Worlds</h1>
      <p>Explore the 14 kingdoms.</p>

      <div className="worlds-grid">
        {KINGDOMS.map((k) => (
          <a key={k.name} className="card" href={`/worlds/${k.slug}`}>
            <div className="card-thumb">
              <div className="emoji" aria-hidden="true">{k.emoji}</div>
            </div>
            <div className="card-body">
              <h2>{k.name}</h2>
              <p>{k.blurb}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

