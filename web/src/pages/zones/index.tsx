import { Link } from "react-router-dom";

export default function Zones() {
  return (
    <section>
      <h2>Zones</h2>
      <p>Browse biomes and worlds.</p>
      <ul>
        <li><Link to="/zones/music">Music</Link></li>
        <li><Link to="/zones/wellness">Wellness</Link></li>
        <li><Link to="/zones/creator-lab">Creator Lab</Link></li>
        <li><Link to="/zones/community">Community</Link></li>
        <li><Link to="/zones/teachers">Teachers</Link></li>
        <li><Link to="/zones/partners">Partners</Link></li>
        <li><Link to="/zones/parents">Parents</Link></li>
        <li><Link to="/naturversity">Naturversity</Link></li>
        <li><Link to="/rainforest">Rainforest</Link></li>
      </ul>
    </section>
  );
}

