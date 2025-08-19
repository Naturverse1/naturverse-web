import { Link } from "react-router-dom";

export default function Rainforest() {
  return (
    <section>
      <h2>🌧️ Rainforest</h2>
      <p>Welcome to the rainforest zone.</p>
      <ul>
        <li><Link to="/rainforest/animals">Animals</Link></li>
        <li><Link to="/rainforest/plants">Plants</Link></li>
        <li><Link to="/rainforest/ecosystem">Ecosystem</Link></li>
        <li><Link to="/rainforest/quiz">Quiz</Link></li>
      </ul>
    </section>
  );
}

