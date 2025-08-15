import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";

type UserProfile = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [authView, setAuthView] = useState<"signIn" | "signUp" | "magic" | "guest">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile from users table
  async function fetchProfile() {
    setLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, avatar_url")
      .eq("id", authUser.id)
      .single();
    if (error) setError(error.message);
    setUser(data);
    setAvatarUrl(data?.avatar_url ?? null);
    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchProfile());
    return () => { listener?.subscription.unsubscribe(); };
    // eslint-disable-next-line
  }, []);

  // Auth handlers
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  }
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
  }
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
  }
  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
  }
  async function handleApple() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "apple" });
    if (error) setError(error.message);
  }
  async function handleGuest() {
    setError(null);
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) setError(error.message);
    else fetchProfile();
  }
  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setAvatarUrl(null);
  }

  // Avatar upload
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      setError(null);
      const file = e.target.files?.[0];
      if (!file || !user) return;
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      // Update user profile
      await supabase.from("users").update({ avatar_url: data.publicUrl }).eq("id", user.id);
      fetchProfile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  // UI
  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;
  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Sign in to Naturverse</h2>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setAuthView("signIn")}>Email/Password</button>
          <button onClick={() => setAuthView("signUp")}>Sign Up</button>
          <button onClick={() => setAuthView("magic")}>Magic Link</button>
          <button onClick={handleGoogle}>Google</button>
          <button onClick={handleApple}>Apple</button>
          <button onClick={handleGuest}>Continue as Guest</button>
        </div>
        {authView === "signIn" && (
          <form onSubmit={handleSignIn}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Sign In</button>
          </form>
        )}
        {authView === "signUp" && (
          <form onSubmit={handleSignUp}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
          </form>
        )}
        {authView === "magic" && (
          <form onSubmit={handleMagicLink}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">Send Magic Link</button>
          </form>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Welcome, {user.username || "Guest"}!</h2>
      <div>
        <strong>Email:</strong> {user.email || "Anonymous"}
      </div>
      <div>
        <strong>Avatar:</strong><br />
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <span>No avatar</span>
        )}
        <br />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarUpload}
        />
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Avatar"}
        </button>
      </div>
      <button onClick={handleSignOut} style={{ marginTop: 24 }}>Sign Out</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
