import Leaderboard from "../../components/Leaderboard";

export default function Game1() {
  // Your game logic stays; this just shows/uses the shared leaderboard API
  return (
    <section>
      <h1>Game 1</h1>
      <p>Play and post your score.</p>
      <Leaderboard game="game1" />
    </section>
  );
}

