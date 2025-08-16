import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { uploadAvatar, removeAvatarIfExists } from "@/lib/avatar";

type UserProfile = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  avatar_path?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      .select("id, username, email, avatar_url, avatar_path")
      .eq("id", authUser.id)
      .single();
    if (error) setError(error.message);
    setUser(data as UserProfile);
    setAvatarUrl((data?.avatar_url as string) ?? null);
    setAvatarPath((data?.avatar_path as string) ?? null);
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

  // Avatar select handler
  function handleSelectAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      window.alert("Only image files are allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB).");
      window.alert("File too large (max 5MB).");
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  // Avatar save handler
  async function handleSaveAvatar() {
    if (!user || !file) {
      window.alert("No file selected.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      // Remove old avatar if path exists (migration safeguard: skip if missing)
      if (user.avatar_path) {
        await removeAvatarIfExists(supabase, user.avatar_path);
      }
      // Upload new avatar
      console.log("Uploading avatar:", file.type, file.size);
      const { publicUrl, path } = await uploadAvatar(supabase, user.id, file);
      if (!publicUrl) {
        console.log("getPublicUrl returned undefined, fallback path:", path);
      }
      // Update DB with both url and path
      const { error: dbErr, data: updated } = await supabase.from("users").update({ avatar_url: publicUrl, avatar_path: path }).eq("id", user.id).select();
      if (dbErr) throw dbErr;
      setAvatarUrl(publicUrl);
      setAvatarPath(path);
      setFile(null);
      setPreviewUrl(null);
      setUser((u) => u ? { ...u, avatar_url: publicUrl, avatar_path: path } : u);
      console.log("Avatar uploaded:", { publicUrl, path, updated });
      fetchProfile();
      window.alert("Avatar updated");
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
      window.alert(err.message || "Failed to upload avatar");
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


  // Revoke preview object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Welcome, {user.username || "Guest"}!</h2>
      <div>
        <strong>Email:</strong> {user.email || "Anonymous"}
      </div>
      <div>
        <strong>Avatar:</strong><br />
        <img
          src={previewUrl || avatarUrl || "/avatar-placeholder.png"}
          alt="avatar"
          import React, { useEffect, useState, useRef } from "react";
          import { supabase } from "@/supabaseClient";
          import { uploadAvatar, removeAvatarIfExists } from "@/lib/avatar";
          import { useAuth } from "@/providers/AuthProvider";

          export default function ProfilePage() {
            const { user: authUser } = useAuth();
            const [user, setUser] = useState<any>(null);
            const [loading, setLoading] = useState(true);
            const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
            const [avatarPath, setAvatarPath] = useState<string | null>(null);
            const [file, setFile] = useState<File | null>(null);
            const [previewUrl, setPreviewUrl] = useState<string | null>(null);
            const [uploading, setUploading] = useState(false);
            const [error, setError] = useState<string | null>(null);
            const fileInputRef = useRef<HTMLInputElement>(null);

            // Fetch user profile from users table
            async function fetchProfile() {
              setLoading(true);
              if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
              }
              const { data, error } = await supabase
                .from("users")
                .select("id, username, email, avatar_url, avatar_path")
                .eq("id", authUser.id)
                .single();
              if (error) setError(error.message);
              setUser(data);
              setAvatarUrl((data?.avatar_url as string) ?? null);
              setAvatarPath((data?.avatar_path as string) ?? null);
              setLoading(false);
            }

            useEffect(() => {
              fetchProfile();
              // Only refetch on authUser change
              // eslint-disable-next-line
            }, [authUser]);

            // Avatar select handler
            function handleSelectAvatar(e: React.ChangeEvent<HTMLInputElement>) {
              setError(null);
              const f = e.target.files?.[0];
              if (!f) return;
              if (!f.type.startsWith("image/")) {
                setError("Only image files are allowed.");
                window.alert("Only image files are allowed.");
                return;
              }
              if (f.size > 5 * 1024 * 1024) {
                setError("File too large (max 5MB).");
                window.alert("File too large (max 5MB).");
                return;
              }
              setFile(f);
              setPreviewUrl(URL.createObjectURL(f));
            }

            // Avatar save handler
            async function handleSaveAvatar() {
              if (!user || !file) {
                window.alert("No file selected.");
                return;
              }
              setUploading(true);
              setError(null);
              try {
                // Remove old avatar if path exists (migration safeguard: skip if missing)
                if (user.avatar_path) {
                  await removeAvatarIfExists(supabase, user.avatar_path);
                }
                // Upload new avatar
                const { publicUrl, path } = await uploadAvatar(supabase, user.id, file);
                // Update DB with both url and path
                const { error: dbErr, data: updated } = await supabase.from("users").update({ avatar_url: publicUrl, avatar_path: path }).eq("id", user.id).select();
                if (dbErr) throw dbErr;
                setAvatarUrl(publicUrl);
                setAvatarPath(path);
                setFile(null);
                setPreviewUrl(null);
                setUser((u: any) => u ? { ...u, avatar_url: publicUrl, avatar_path: path } : u);
                fetchProfile();
                window.alert("Avatar updated");
              } catch (err: any) {
                setError(err.message || "Failed to upload avatar");
                window.alert(err.message || "Failed to upload avatar");
              } finally {
                setUploading(false);
              }
            }

            // Revoke preview object URL on unmount
            useEffect(() => {
              return () => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
              };
            }, [previewUrl]);

            if (loading) return <div style={{ padding: 32 }}>Loading…</div>;
            if (!user) return null;

            return (
              <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
                <h2>Welcome, {user.username || "Guest"}!</h2>
                <div>
                  <strong>Email:</strong> {user.email || "Anonymous"}
                </div>
                <div>
                  <strong>Avatar:</strong><br />
                  <img
                    src={previewUrl || avatarUrl || "/avatar-placeholder.png"}
                    alt="avatar"
                    style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.png"; }}
                  />
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleSelectAvatar}
                  />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    Choose Avatar
                  </button>
                  {file && (
                    <button onClick={handleSaveAvatar} disabled={uploading} style={{ marginLeft: 8 }}>
                      {uploading ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }} style={{ marginTop: 24 }}>Sign Out</button>
                {error && <div style={{ color: "red" }}>{error}</div>}
              </div>
            );
          }
