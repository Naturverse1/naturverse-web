import TurianChat from "../components/TurianChat";
import "../styles/turian.css";

export default function TurianPage() {
  return (
    <div className="turian-page">
      <section className="hero">
        <h1>Turian the Durian</h1>
        <p>Ask for tips, quests, and facts. Turian is standing by with cheerful guidance.</p>
      </section>

      <h2 style={{ textAlign: "center" }}>Chat with Turian</h2>
      <TurianChat />
      <p style={{ textAlign: "center", opacity: .7, marginTop: 8, fontSize: 14 }}>
        Uses a free demo model via a secure Netlify Function. If the model isn’t reachable, Turian role-plays locally so the page never feels empty.
      </p>
    </div>
  );
}
