import { Link } from 'react-router-dom';

export default function Home() {
  const LinkDot = ({to, children}:{to:string; children:React.ReactNode}) =>
    <><Link to={to}>{children}</Link> {' · '}</>;
  return (
    <>
      <h2>Explore</h2>
      <p>
        <LinkDot to="/zones">Zones</LinkDot>
        <LinkDot to="/marketplace">Marketplace</LinkDot>
        <LinkDot to="/arcade">Arcade</LinkDot>
        <Link to="/worlds">Worlds</Link>
      </p>

      <h2>Zones (shortcuts)</h2>
      <p>
        <LinkDot to="/zones/music">Music</LinkDot>
        <LinkDot to="/zones/wellness">Wellness</LinkDot>
        <LinkDot to="/zones/creator-lab">Creator Lab</LinkDot>
        <LinkDot to="/zones/community">Community</LinkDot>
        <LinkDot to="/zones/teachers">Teachers</LinkDot>
        <LinkDot to="/zones/partners">Partners</LinkDot>
        <LinkDot to="/zones/naturversity">Naturversity</LinkDot>
        <Link to="/zones/parents">Parents</Link>
      </p>

      <h2>Content</h2>
      <p>
        <LinkDot to="/stories">Stories</LinkDot>
        <LinkDot to="/quizzes">Quizzes</LinkDot>
        <LinkDot to="/observations">Observations</LinkDot>
        <Link to="/tips">Turian Tips</Link>
      </p>

      <h2>Account</h2>
      <p><Link to="/profile">Profile & Settings</Link></p>
    </>
  );
}
