import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live and the client router is working.</p>

      <h2>Explore</h2>
      <p>
        <Link to="/zones">Zones</Link> •{" "}
        <Link to="/marketplace">Marketplace</Link> •{" "}
        <Link to="/arcade">Arcade</Link> •{" "}
        <Link to="/worlds">Worlds</Link>
      </p>

      <h2>Zones (shortcuts)</h2>
      <p>
        <Link to="/zones/music">Music</Link> •{" "}
        <Link to="/zones/wellness">Wellness</Link> •{" "}
        <Link to="/zones/creator-lab">Creator Lab</Link> •{" "}
        <Link to="/zones/community">Community</Link> •{" "}
        <Link to="/zones/teachers">Teachers</Link> •{" "}
        <Link to="/zones/partners">Partners</Link> •{" "}
        <Link to="/zones/naturversity">Naturversity</Link> •{" "}
        <Link to="/zones/parents">Parents</Link>
      </p>

      <h2>Content</h2>
      <p>
        <Link to="/content/stories">Stories</Link> •{" "}
        <Link to="/content/quizzes">Quizzes</Link> •{" "}
        <Link to="/content/observations">Observations</Link> •{" "}
        <Link to="/tips">Turian Tips</Link>
      </p>

      <h2>Account</h2>
      <p><Link to="/account">Profile & Settings</Link></p>
    </main>
  );
}
