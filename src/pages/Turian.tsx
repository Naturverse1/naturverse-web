import TurianChat from "../components/TurianChat";
import "./turian.css";

export default function Turian() {
  return (
    <main className="turian-page" role="main" aria-labelledby="turian-title">
      <nav className="turian-breadcrumb breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span className="sep" aria-hidden>
          /
        </span>
        <span>Turian</span>
      </nav>

      <header className="turian-hero">
        <h1 id="turian-title">Turian the Durian</h1>
        <p className="lead">
          Ask for tips, quests, and facts. Turian is standing by with cheerful guidance.
        </p>
      </header>

      <TurianChat />
    </main>
  );
}

