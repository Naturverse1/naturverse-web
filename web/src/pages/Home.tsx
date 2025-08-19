import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live and the client router is working.</p>

      <h2 style={{ marginTop: 24 }}>Explore</h2>
      <nav style={{ lineHeight: 1.9 }}>
        <div><Link to="/zones">Zones</Link></div>
        <div><Link to="/marketplace">Marketplace</Link></div>
        <div><Link to="/arcade">Arcade</Link></div>
        <div><Link to="/worlds">Worlds</Link></div>
      </nav>

      <h2 style={{ marginTop: 24 }}>Zones (shortcuts)</h2>
      <nav style={{ lineHeight: 1.9 }}>
        <div><Link to="/music">Music</Link></div>
        <div><Link to="/wellness">Wellness</Link></div>
        <div><Link to="/creator-lab">Creator Lab</Link></div>
        <div><Link to="/community">Community</Link></div>
        <div><Link to="/teachers">Teachers</Link></div>
        <div><Link to="/partners">Partners</Link></div>
        <div><Link to="/naturversity">Naturversity</Link></div>
        <div><Link to="/parents">Parents</Link></div>
      </nav>

      <h2 style={{ marginTop: 24 }}>Content</h2>
      <nav style={{ lineHeight: 1.9 }}>
        <div><Link to="/stories">Stories</Link></div>
        <div><Link to="/quizzes">Quizzes</Link></div>
        <div><Link to="/observations">Observations</Link></div>
        <div><Link to="/tips">Turian Tips</Link></div>
      </nav>

      <h2 style={{ marginTop: 24 }}>Account</h2>
      <nav style={{ lineHeight: 1.9 }}>
        <div><Link to="/account">Profile</Link></div>
        <div><Link to="/web3">Web3</Link></div>
      </nav>
    </div>
  );
}
