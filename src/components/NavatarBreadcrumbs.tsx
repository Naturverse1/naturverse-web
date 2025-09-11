import { Link } from 'react-router-dom';

export default function NavatarBreadcrumbs() {
  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link>
    </nav>
  );
}
