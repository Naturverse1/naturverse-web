import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function NavatarHub() {
  return (
    <main className="navatar-container">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <h1 className="page-title">Your Navatar</h1>
      <p className="muted">No Navatar yet — pick one below.</p>

      <div className="hub-cards">
        <section className="hub-card">
          <h2>Pick Navatar</h2>
          <p>Choose from our characters.</p>
          <Link to="/navatar/pick" className="hub-link">Open</Link>
        </section>

        <section className="hub-card disabled">
          <h2>Upload</h2>
          <p>Coming next.</p>
          <a className="hub-link" aria-disabled="true">View</a>
        </section>

        <section className="hub-card disabled">
          <h2>Describe &amp; Generate</h2>
          <p>Coming next.</p>
          <a className="hub-link" aria-disabled="true">View</a>
        </section>
      </div>
    </main>
  );
}
