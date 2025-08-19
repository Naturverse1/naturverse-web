import { Link } from "react-router-dom";

export default function ZonesIndex() {
  const items = [
    { to: "/zones/music", label: "Music" },
    { to: "/zones/wellness", label: "Wellness" },
    { to: "/zones/creator-lab", label: "Creator Lab" },
    { to: "/zones/community", label: "Community" },
    { to: "/zones/teachers", label: "Teachers" },
    { to: "/zones/partners", label: "Partners" },
    { to: "/zones/naturversity", label: "Naturversity" },
    { to: "/zones/parents", label: "Parents" },
    { to: "/zones/arcade", label: "Arcade" },
  ];
  return (
    <section>
      <h2>Zones</h2>
      <ul>
        {items.map(i=>(
          <li key={i.to}><Link to={i.to}>{i.label}</Link></li>
        ))}
      </ul>
    </section>
  );
}
