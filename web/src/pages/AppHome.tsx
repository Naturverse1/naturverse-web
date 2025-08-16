import { useAuth } from "@/auth/session";

export default function AppHome() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1>Welcome back{user ? `, ${user.email}` : ""}!</h1>
      <p>This is your app home. From here we’ll link to Profile, Worlds, etc.</p>
    </div>
  );
}
