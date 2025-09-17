import TurianChat from "../components/TurianChat";
import "./turian.css";

export default function TurianPage() {
  return (
    <main className="nv-page">
      <nav className="nv-breadcrumbs">
        <a href="/">Home</a> <span>/</span> <span>Turian</span>
      </nav>

      <section className="nv-hero">
        <h1 className="nv-hero_title">Turian the Durian</h1>
        <p className="nv-hero_sub">
          Ask for tips, quests, and facts. Turian is standing by with cheerful guidance.
        </p>
      </section>

      <section className="turian-chat_section">
        <h2 className="turian-chat_heading">Chat with Turian</h2>
        {/* badge lives inside the card header; status text is set by the component */}
        <TurianChat />
      </section>
    </main>
  );
}

