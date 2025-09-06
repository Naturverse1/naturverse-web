import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Pick() {
  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb nv-subcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>

      <h2 className="nv-h2">Pick a Preset</h2>
      {/* ... your filter chips + grid ... */}
    </section>
  );
}
