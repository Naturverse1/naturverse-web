export default function Zones() {
  const zones = [
    ["Arcade", "Mini-games, leaderboards & tournaments.", "🕹️"],
    ["Music", "Karaoke, AI beats & song maker.", "🎤🥁"],
    ["Wellness", "Yoga, breathing, stretches, mindful quests.", "🧘‍♂️"],
    ["Creator Lab", "AI art & character cards.", "🎨🤖"],
    ["Stories", "AI story paths set in all 14 kingdoms.", "📚✨"],
    ["Quizzes", "Solo & party quiz play with scoring.", "🧠🎯"],
    ["Observations", "Upload nature pics; tag, learn, earn.", "📷🌿"]
  ];
  return (
    <section>
      <h1>Zones</h1>
      <div className="grid">
        {zones.map(([title, desc, emoji]) => (
          <div key={title} className="card">
            <div className="card-emoji">{emoji}</div>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
