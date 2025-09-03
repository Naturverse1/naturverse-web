import { Link } from 'react-router-dom';
import '../../styles/breadcrumbs.css';
import '../../styles/navatar.css';
export default function NavatarUpload() {
  return (
    <div className="navatar-wrap">
      <nav className="breadcrumbs"><Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / Upload</nav>
      <h1 className="navatar-title">Upload (Coming Soon)</h1>
      <p>We’ll wire this up next.</p>
    </div>
  );
}

