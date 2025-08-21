const kingdoms = [
  ["Thailandia", "Coconuts & Elephants", "🐘🥥"],
  ["Chinlandia", "Bamboo & Pandas", "🐼🎋"],
  ["Indilandia", "Tigers & Mangoes", "🐯🥭"],
  ["Japania", "Sakura & Foxes", "🦊🌸"],
  ["Korea", "Kimchi & Cranes", "🕊️🥬"],
  ["Arabia", "Dates & Falcons", "🦅🌴"],
  ["Egyptia", "Pyramids & Camels", "🏜️🐪"],
  ["Europa", "Castles & Owls", "🏰🦉"],
  ["Afrika", "Savanna & Lions", "🦁🌾"],
  ["Amazonia", "River & Macaws", "🦜🌧️"],
  ["Arctica", "Ice & Polar Bears", "❄️🐻‍❄️"],
  ["Aussia", "Reefs & Kangaroos", "🐨🪸"],
  ["Pacifica", "Islands & Turtles", "🏝️🐢"],
  ["Atlantis", "Corals & Dolphins", "🐬🪸"]
];

export default function Worlds() {
  return (
    <section>
      <h1>Worlds</h1>
      <div className="grid">
        {kingdoms.map(([name, tagline, emoji]) => (
          <div key={name} className="card">
            <div className="card-emoji">{emoji}</div>
            <div>
              <h3>{name}</h3>
              <p>{tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
