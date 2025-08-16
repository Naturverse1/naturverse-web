import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="nv-wrap">
      <section className="hero">
        <h1>Welcome to The Naturverse!</h1>
        <p>Sign in to start your magical learning journey ✨🌿</p>
        <Link className="nv-btn" to="/app">Start Your Adventure</Link>
      </section>

      <section className="mt-4">
        <h2>Explore Amazing Worlds</h2>
        <div className="grid">
          <WorldCard title="Tropical Rainforest" desc="Explore lush rainforests with Turian." link="/worlds#rainforest" />
          <WorldCard title="Ocean Adventures" desc="Dive into crystal-clear waters." link="/worlds#ocean" />
          <WorldCard title="Magical Stories" desc="Stories of transformation & nature's magic." link="/worlds#stories" />
          <WorldCard title="Brain Challenge" desc="Quick quizzes and puzzles." link="/worlds#brain" />
        </div>
        <p className="small mt-2">Tip: open the “Worlds” page for full details.</p>
      </section>
    </div>
  );
}

function WorldCard({ title, desc, link }:{title:string;desc:string;link:string}) {
  return (
    <a className="card" href={link}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="small">Enter →</span>
    </a>
  );
}
