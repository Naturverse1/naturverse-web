import { Link } from "react-router-dom";
import { Section } from "./_shared";

export default function Arcade() {
  return (
    <Section title="Arcade">
      <div><Link to="/arcade/game-1">Game 1</Link></div>
      <div><Link to="/arcade/game-2">Game 2</Link></div>
      <div><Link to="/arcade/game-3">Game 3</Link></div>
    </Section>
  );
}
