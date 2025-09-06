import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Pick() {
  return (
    <section className="nv-section nv-center">
      <nav className="nv-breadcrumb nv-bc-blue">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>
      <h2 className="nv-h2">Pick Navatar</h2>
      <div className="nv-grid nv-grid-big">
        {/* map preset cards here */}
      </div>
    </section>
  );
}

