import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { assetUrlOrPlaceholder } from "@/lib/assets";

const Header: React.FC = () => {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = user?.avatar_url;
  const initials = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/app">App</Link>
        <Link to="/profile">Profile</Link>
      </div>
      {session && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ cursor: "pointer" }} onClick={() => navigate("/profile") }>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                width={32}
                height={32}
                style={{ borderRadius: 16, objectFit: "cover", background: "#f3f3f3", border: "1px solid #ccc" }}
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = assetUrlOrPlaceholder(); }}
              />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 16, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
                {initials}
              </div>
            )}
          </div>
          <button onClick={() => { signOut(); navigate("/login"); }}>Sign Out</button>
        </div>
      )}
    </nav>
  );
};

export default Header;
