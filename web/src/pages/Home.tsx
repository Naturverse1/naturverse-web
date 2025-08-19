import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ padding: 24, lineHeight: 1.6 }}>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live and the client router is working.</p>

      <h2>Explore</h2>
      <Nav to="/zones">Zones</Nav>
      <Nav to="/marketplace">Marketplace</Nav>
      <Nav to="/arcade">Arcade</Nav>
      <Nav to="/worlds">Worlds</Nav>

      <h2>Zones (shortcuts)</h2>
      <Nav to="/zones/music">Music</Nav>
      <Nav to="/zones/wellness">Wellness</Nav>
      <Nav to="/zones/creator-lab">Creator Lab</Nav>
      <Nav to="/zones/community">Community</Nav>
      <Nav to="/zones/teachers">Teachers</Nav>
      <Nav to="/zones/partners">Partners</Nav>
      <Nav to="/zones/naturversity">Naturversity</Nav>
      <Nav to="/zones/parents">Parents</Nav>

      <h2>Content</h2>
      <Nav to="/content/stories">Stories</Nav>
      <Nav to="/content/quizzes">Quizzes</Nav>
      <Nav to="/content/observations">Observations</Nav>
      <Nav to="/tips">Turian Tips</Nav>

      <h2>Account</h2>
      <Nav to="/account">Profile & Settings</Nav>
    </main>
  );
}

function Nav({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div>
      <Link to={to}>{children}</Link>
    </div>
  );
}
