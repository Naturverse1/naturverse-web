import { Link } from 'react-router-dom';

export default function WorldHub() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>World Hub</h1>
      <p>3D island hub is coming soon. We’re keeping the build lean while we wire up graphics.</p>
      <p><Link to="/zones">Back to Zones</Link></p>
    </main>
  );
}
