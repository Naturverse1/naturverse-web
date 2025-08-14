import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <main style={{padding: "2rem"}}>
      <h1>Welcome to Naturverse</h1>
      <p>Explore the demo, then sign in to access the app.</p>
      <p>
        <Link to="/login">Sign in</Link> · <Link to="/app">Enter app</Link>
      </p>
    </main>
  );
}
