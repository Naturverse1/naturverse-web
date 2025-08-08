import UserProfileEditor from "../components/UserProfileEditor";

export default function Profile() {
  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <UserProfileEditor className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl" />
      </div>
    </div>
  );
}