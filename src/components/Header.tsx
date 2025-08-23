import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="site-header">
      {/* left: logo + brand */}
      {/* center: nav links */}
      <nav className="nav-links">…</nav>

      {/* right: account */}
      {user ? (
        <div className="account">
          <a className="account-name" href="/profile">
            {user.user_metadata?.name || user.email}
          </a>
          {/* Desktop sign out only */}
          <form
            className="ml-2 hidden md:inline-block"
            action="/logout"
            method="post"
          >
            <button className="btn btn-small" type="submit">
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <a className="btn btn-small" href="/login">
          Sign in
        </a>
      )}
    </header>
  );
}
