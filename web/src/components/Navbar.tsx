import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/session";
import { supabase } from "@/supabaseClient";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  return (
    <nav className="nav">
      <Link to="/" className="brand">Naturverse</Link>
      <div className="spacer" />
      {user ? (
        <>
          <Link to="/app">App</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  );
}
