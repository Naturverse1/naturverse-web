import Link from "next/link";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { getNavatarUrl } from "@/lib/profile";

export default function Navbar() {
  const user = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (user?.id) {
        const url = await getNavatarUrl(user.id);
        if (mounted) setAvatarUrl(url);
      } else {
        setAvatarUrl(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  return (
    <nav className="nv-navbar">
      <div className="nv-left">
        {/* existing logo + primary nav */}
      </div>
      <div className="nv-right">
        {user ? (
          <Link href="/profile" className="nv-profile">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={28}
                height={28}
                className="nv-profile-img"
              />
            ) : (
              <span className="nv-profile-emoji" aria-label="profile">
                👤
              </span>
            )}
          </Link>
        ) : (
          <Link href="/signin">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
