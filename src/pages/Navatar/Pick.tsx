import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Pick() {
  return (
    <main className="nv-wrap">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>
      <h1 className="nv-h1">Pick</h1>
      <p className="nv-muted">Coming soon…</p>
    </main>
  );
}
