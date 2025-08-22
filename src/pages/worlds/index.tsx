import React from "react";

type Kingdom = { name: string; emoji: string; blurb: string };

const KINGDOMS: Kingdom[] = [
  { name: "Thailandia",   emoji: "🗺️", blurb: "Coconuts & Elephants" },
  { name: "Brazilandia",  emoji: "🍌", blurb: "Bananas & Parrots" },
  { name: "Indilandia",   emoji: "🥭", blurb: "Mangoes & Tigers" },
  { name: "Amerilandia",  emoji: "🍎", blurb: "Apples & Eagles" },
  { name: "Australandia", emoji: "🍑", blurb: "Peaches & Kangaroos" },
  { name: "Chilandia",    emoji: "🎍", blurb: "Bamboo (shoots) & Pandas" },
  { name: "Japonica",     emoji: "🌸", blurb: "Cherry Blossoms & Foxes" },
  { name: "Africania",    emoji: "🦁", blurb: "Mangoes & Lions" },
  { name: "Europalia",    emoji: "🌻", blurb: "Sunflowers & Hedgehogs" },
  { name: "Britannula",   emoji: "🌹", blurb: "Roses & Hedgehogs" },
  { name: "Kiwilandia",   emoji: "🥝", blurb: "Kiwis & Sheep" },
  { name: "Madagascaria", emoji: "🍋", blurb: "Lemons & Lemurs" },
  { name: "Greenlandia",  emoji: "🧊", blurb: "Ice & Polar Bears" },
  { name: "Antarctiland", emoji: "❄️", blurb: "Ice Crystals & Penguins" },
];

export default function WorldsIndex() {
  return (
    <div>
      <h1>Worlds</h1>
      <p>Explore the 14 kingdoms.</p>

      <div className="worlds-grid">
        {KINGDOMS.map((k) => (
          <div key={k.name} className="card">
            <div className="card-thumb">
              <div className="emoji" aria-hidden="true">{k.emoji}</div>
            </div>
            <div className="card-body">
              <h2>{k.name}</h2>
              <p>{k.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

