import { useAuth } from '@/lib/auth-context';

export default function UserAvatar() {
  const { user } = useAuth();
  if (!user) return null;

  const meta: any = user.user_metadata ?? {};
  const src =
    meta.navatarUrl ||
    meta.navatar_url ||
    meta.avatar_url ||
    meta.picture ||
    null;

  const name = meta.name || meta.full_name || user.email || '';
  const initial = name.trim().charAt(0).toUpperCase() || '•';

  return (
    <a href="/profile" className="nv-avatar" aria-label="Profile">
      {src ? (
        <img src={src} alt="" />
      ) : (
        <span className="nv-avatar-initial" aria-hidden>
          {initial}
        </span>
      )}
    </a>
  );
}
