import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function NavatarHub() {
  return (
    <main className="navatar-wrap">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>
      <h1 className="page-title">Your Navatar</h1>

      <section className="hub-cards">
        <article className="hub-card">
          <h2>Pick Navatar</h2>
          <p>Choose from our characters.</p>
          <Link to="/navatar/pick" className="hub-link">Open</Link>
        </article>

        <article className="hub-card hub-disabled">
          <h2>Upload</h2>
          <p>Coming next.</p>
          <span className="hub-link">View</span>
        </article>

        <article className="hub-card hub-disabled">
          <h2>Describe &amp; Generate</h2>
          <p>Coming next.</p>
          <span className="hub-link">View</span>
        </article>
      </section>
    </main>
  );
}
