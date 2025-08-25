'use client';
import * as React from 'react';
import Link from 'next/link';
import { supabase, getSession, getUser } from '@/lib/auth';
import ProfileHead from '@/components/ProfileHead';

export default function NavBar() {
  const [isAuthed, setIsAuthed] = React.useState(false);
  const [headEmoji, setHeadEmoji] = React.useState<string | null>(null);

  React.useEffect(() => {
    // initial
    (async () => {
      const session = await getSession();
      setIsAuthed(!!session);
      if (session) {
        const u = await getUser();
        // Prefer a saved Navatar emoji in user_metadata, else fallback
        const meta = (u?.user_metadata ?? {}) as Record<string, any>;
        setHeadEmoji(meta.navatarEmoji ?? meta.avatar_emoji ?? '🙂');
      }
    })();

    // live updates (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const authed = !!session;
      setIsAuthed(authed);
      if (!authed) {
        setHeadEmoji(null);
      } else {
        const meta = (session.user?.user_metadata ?? {}) as Record<string, any>;
        setHeadEmoji(meta.navatarEmoji ?? meta.avatar_emoji ?? '🙂');
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

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
          <Link className="nv-cart" href="/cart" aria-label="Cart">🛒</Link>

          {/* NEW: profile head only when authed */}
          {isAuthed && (
            <Link href="/profile" className="nv-profile" aria-label="Profile">
              <ProfileHead emoji={headEmoji ?? '🙂'} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
