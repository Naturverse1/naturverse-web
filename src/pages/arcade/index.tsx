import { Link } from "react-router-dom";
import Leaderboard from "../../components/Leaderboard";

export default function Arcade() {
  return (
    <section>
      <h1>Arcade</h1>
      <p><Link to="/arcade/game1">Game 1</Link> · <Link to="/arcade/game2">Game 2</Link> · <Link to="/arcade/game3">Game 3</Link></p>
      <Leaderboard game="game1" />
    </section>
  );
}

