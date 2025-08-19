import { Link } from "react-router-dom";

export default function CreatorLab() {
  return (
    <section>
      <h2>🧪 Creator Lab</h2>
      <p>Prototype ideas fast. Share experiments. Iterate.</p>
      <ul>
        <li>Start in <Link to="/observations-demo">Observations Demo</Link></li>
        <li>Turn a sketch into a story in <Link to="/story-studio">Story Studio</Link></li>
        <li>Ship a mini-game to the <Link to="/arcade">Arcade</Link></li>
      </ul>
    </section>
  );
}

