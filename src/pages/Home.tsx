import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h2 className="h1">Explore</h2>
      <p className="lead">Choose a section from the navigation above.</p>

      <div className="grid">
        {[
          ["Worlds","/worlds"],
          ["Zones","/zones"],
          ["Arcade","/arcade"],
          ["Marketplace","/marketplace"],
          ["Stories","/stories"],
          ["Quizzes","/quizzes"],
          ["Observations","/observations"],
          ["Naturversity","/naturversity"],
          ["Turian Tips","/tips"],
          ["Profile","/profile"],
        ].map(([label,href])=> (
          <Link key={href} to={href as string} className="card">
            <strong>{label}</strong>
            <div className="lead">Open {label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

