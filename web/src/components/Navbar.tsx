import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const Navbar: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = user?.avatar_url ?? "/avatar-placeholder.png";

  if (!session) {
    return (
      <nav style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/login">Sign in</Link>
      </nav>
    );
  }

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/app">App</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/profile") }>
        <img
          src={avatarUrl}
          alt="avatar"
          width={32}
          height={32}
          style={{ borderRadius: 16, objectFit: "cover", background: "#f3f3f3", border: "1px solid #ccc" }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
