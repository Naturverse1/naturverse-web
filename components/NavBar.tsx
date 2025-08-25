'use client';
import Link from 'next/link';
import ProfileHead from '@/components/ProfileHead';
import { useAuth } from '@/lib/auth-context';

export default function NavBar() {
  const { ready, user } = useAuth();
  const headEmoji =
    (user?.user_metadata?.navatarEmoji as string) ??
    (user?.user_metadata?.avatar_emoji as string) ??
    '🙂';

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
          {ready && user ? (
            <>
              <Link className="nv-cart" href="/cart" aria-label="Cart">
                🛒
              </Link>
              <Link href="/profile" className="nv-profile" aria-label="Profile">
                <ProfileHead emoji={headEmoji} />
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
