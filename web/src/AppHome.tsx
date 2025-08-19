import { Link } from "react-router-dom";

export default function AppHome() {
  return (
    <section>
      <h1>The Naturverse</h1>
      <p>Welcome 🌿 Naturverse is live and the client router is working.</p>

      <h3>Explore</h3>
      <ul>
        <li><Link to="/zones">Zones</Link></li>
        <li><Link to="/marketplace">Marketplace</Link></li>
        <li><Link to="/arcade">Arcade</Link></li>
        <li><Link to="/worlds">Worlds</Link></li>
      </ul>

      <h3>Zones (shortcuts)</h3>
      <ul>
        <li><Link to="/zones/music">Music</Link></li>
        <li><Link to="/zones/wellness">Wellness</Link></li>
        <li><Link to="/zones/creator-lab">Creator Lab</Link></li>
        <li><Link to="/zones/community">Community</Link></li>
        <li><Link to="/zones/teachers">Teachers</Link></li>
        <li><Link to="/zones/partners">Partners</Link></li>
        <li><Link to="/naturversity">Naturversity</Link></li>
        <li><Link to="/zones/parents">Parents</Link></li>
      </ul>

      <h3>Content</h3>
      <ul>
        <li><Link to="/stories">Stories</Link></li>
        <li><Link to="/quizzes">Quizzes</Link></li>
        <li><Link to="/observations">Observations</Link></li>
        <li><Link to="/turian-tips">Turian Tips</Link></li>
      </ul>

      <h3>Web3</h3>
      <ul>
        <li><Link to="/web3/wallet">Wallet</Link></li>
        <li><Link to="/web3/coins">Coins</Link></li>
      </ul>

      <h3>Account</h3>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </section>
  );
}

