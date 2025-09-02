import { Link } from 'react-router-dom';
import '../../styles/navatar.css';

export default function NavatarHub() {
  return (
    <div className="container navatar-hub">
      <h1>Navatar</h1>
      <div className="navatar-options">
        <Link className="navatar-option" to="/navatar/pick">Pick Navatar</Link>
        <Link className="navatar-option" to="/navatar/upload">Upload</Link>
        <Link className="navatar-option" to="/navatar/generate">Describe &amp; Generate</Link>
      </div>
    </div>
  );
}
