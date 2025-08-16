import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const Navbar: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      setAvatarUrl((data?.avatar_url as string) ?? null);
    })();
    // Optionally, add a listener for auth/session changes
  }, []);

  return (
    <nav
      style={{
        padding: 16,
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/app">App</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/profile")}
      >
        <img
          src={avatarUrl || "/avatar-placeholder.png"}
          alt="avatar"
          width={32}
          height={32}
          style={{
            borderRadius: 16,
            objectFit: "cover",
            background: "#f3f3f3",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
