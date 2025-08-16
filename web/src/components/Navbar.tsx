import React from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"}`;

export const Navbar: React.FC = () => {
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="w-full sticky top-0 z-30 bg-black/30 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-5xl flex items-center gap-2 px-4 h-14">
        <Link to="/" className="text-white font-semibold">Naturverse</Link>
        <div className="flex-1" />
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/worlds" className={linkClass}>Worlds</NavLink>
        <NavLink to="/app" className={linkClass}>App</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        {email && (
          <button onClick={signOut} className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white">
            Sign out
          </button>
        )}
      </nav>
    </header>
  );
};
