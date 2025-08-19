import { Link } from "react-router-dom";

export default function Arcade() {
  return (
    <section>
      <h2>🎮 Arcade</h2>
      <p>Interactive Naturverse games.</p>
      <ul>
        <li><Link to="/arcade/eco-runner">Eco Runner</Link></li>
        <li><Link to="/arcade/memory-match">Memory Match</Link></li>
        <li><Link to="/arcade/word-builder">Word Builder</Link></li>
      </ul>
    </section>
  );
}

