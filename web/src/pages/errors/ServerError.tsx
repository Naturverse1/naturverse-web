import { Link } from 'react-router-dom';

export default function ServerError() {
  return (
    <main className="page-container" style={{ textAlign: 'center', padding: '80px 16px' }}>
      <h1>We hit a snag (500)</h1>
      <p>Try again.</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/">Go Home</Link>
      </p>
    </main>
  );
}
