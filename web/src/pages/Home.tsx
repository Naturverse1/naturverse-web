import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Welcome 🌿</h2>
      <p>Naturverse is live — explore the zones, worlds, marketplace, and tips.</p>
      <nav>
        <ul>
          <li><Link to="/zones/arcade">Arcade</Link></li>
          <li><Link to="/zones/music">Music Zone</Link></li>
          <li><Link to="/turian-tips">Turian Tips</Link></li>
        </ul>
      </nav>
    </section>
  );
}
