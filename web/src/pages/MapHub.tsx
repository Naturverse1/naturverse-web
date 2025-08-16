import { Link } from 'react-router-dom';

export default function MapHub() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Map</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Link to="/worlds/rainforest" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 4 }}>Tropical Rainforest</Link>
        <Link to="/worlds/ocean" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 4 }}>Ocean Adventures</Link>
        <Link to="/stories" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 4 }}>Magical Stories</Link>
        <Link to="/quizzes" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 4 }}>Brain Challenge</Link>
      </div>
    </main>
  );
}
