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
        <LinkDot to="/music">Music</LinkDot>
        <LinkDot to="/wellness">Wellness</LinkDot>
        <LinkDot to="/creator-lab">Creator Lab</LinkDot>
        <LinkDot to="/community">Community</LinkDot>
        <LinkDot to="/teachers">Teachers</LinkDot>
        <LinkDot to="/partners">Partners</LinkDot>
        <LinkDot to="/naturversity">Naturversity</LinkDot>
        <Link to="/parents">Parents</Link>
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
