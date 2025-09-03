import { Link } from 'react-router-dom';
import '../../styles/breadcrumbs.css';
import '../../styles/navatar.css';
export default function NavatarGenerate() {
  return (
    <div className="navatar-wrap">
      <nav className="breadcrumbs"><Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Describe &amp; Generate</nav>
      <h1 className="navatar-title">Describe &amp; Generate (Coming Soon)</h1>
      <p>We’ll add the AI image flow after Upload.</p>
    </div>
  );
}

