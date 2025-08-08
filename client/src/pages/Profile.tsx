import UserProfileEditor from "../components/UserProfileEditor";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint via-background to-sage/5 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <UserProfileEditor className="modern-card-elevated" />
      </div>
    </div>
  );
}