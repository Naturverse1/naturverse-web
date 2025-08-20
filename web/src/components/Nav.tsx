import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav style={{padding:'0.5rem 0', fontWeight:600}}>
      <Link to="/">Home</Link>{' '}
      <Link to="/worlds">Worlds</Link>{' '}
      <Link to="/zones">Zones</Link>{' '}
      <Link to="/arcade">Arcade</Link>{' '}
      <Link to="/marketplace">Marketplace</Link>{' '}
      <Link to="/stories">Stories</Link>{' '}
      <Link to="/quizzes">Quizzes</Link>{' '}
      <Link to="/observations">Observations</Link>{' '}
      <Link to="/tips">Turian Tips</Link>{' '}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}
