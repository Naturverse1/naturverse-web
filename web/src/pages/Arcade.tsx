import { Link } from 'react-router-dom';
export default function Arcade() {
  return (
    <>
      <h2>Arcade</h2>
      <ul>
        <li><Link to="/arcade/tapper">Game 1 — Tapper</Link></li>
        <li><Link to="/arcade/memory">Game 2 — Memory</Link></li>
        <li><Link to="/arcade/snake">Game 3 — Snake</Link></li>
      </ul>
    </>
  );
}
