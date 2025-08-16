import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile, getPublicAvatarUrl } from "@/lib/avatar";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const prof = await getMyProfile();
      setEmail(prof?.email ?? null);
      setAvatarUrl(getPublicAvatarUrl(prof?.avatar_path));
    })();
  }, []);

  return (
    <nav className="flex items-center gap-3 p-3">
      <Link to="/">Naturverse</Link>
      <Link to="/app">App</Link>
      <Link to="/profile">Profile</Link>
      <div className="ml-auto flex items-center gap-2">
        <img
          src={avatarUrl || "/avatar-placeholder.png"}
          alt="navatar"
          className="h-8 w-8 rounded-full object-cover border border-white/10"
        />
        {email && <span className="text-xs opacity-80">{email}</span>}
      </div>
    </nav>
  );
}
