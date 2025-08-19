import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ padding: 16 }}>
      <h2>404 — Not Found</h2>
      <p><Link to="/">Go home</Link></p>
    </div>
  );
}
