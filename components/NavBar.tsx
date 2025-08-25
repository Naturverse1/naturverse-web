'use client';
import * as React from 'react';
import Link from 'next/link';
import ProfileHead from '@/components/ProfileHead';
import { useAuthState } from '@/src/lib/auth-context';
import { getUser } from '@/lib/auth';

export default function NavBar() {
  const { signedIn, loading } = useAuthState();
  const [headEmoji, setHeadEmoji] = React.useState('🙂');

  React.useEffect(() => {
    if (!signedIn) {
      setHeadEmoji('🙂');
      return;
    }
    (async () => {
      const u = await getUser();
      const meta = (u?.user_metadata ?? {}) as Record<string, any>;
      setHeadEmoji(meta.navatarEmoji ?? meta.avatar_emoji ?? '🙂');
    })();
  }, [signedIn]);

  return (
    <header className="nv-nav">
      <div className="nv-nav-inner">
        <Link className="nv-brand" href="/">Naturverse</Link>

        <nav className="nv-links">
          <Link href="/worlds">Worlds</Link>
          <Link href="/zones">Zones</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/naturversity">Naturversity</Link>
          <Link href="/naturbank">NaturBank</Link>
          <Link href="/navatar">Navatar</Link>
          <Link href="/passport">Passport</Link>
          <Link href="/turian">Turian</Link>
          {signedIn && !loading && (
            <>
              <Link className="nv-cart" href="/cart" aria-label="Cart">
                🛒
              </Link>
              <Link href="/profile" className="nv-profile" aria-label="Profile">
                <ProfileHead emoji={headEmoji} />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
