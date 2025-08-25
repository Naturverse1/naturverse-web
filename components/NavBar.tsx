'use client';
import Link from 'next/link';
import ProfileHead from '@/components/ProfileHead';
import { useAuth } from '@/lib/auth-context';

export default function NavBar() {
  const { ready, user } = useAuth();
  const authed = Boolean(user);
  const headEmoji =
    (user?.user_metadata?.navatarEmoji as string) ??
    (user?.user_metadata?.avatar_emoji as string) ??
    '🙂';

  return (
    <header className="nv-nav">
      <div className="nv-nav-inner">
        <Link className="nv-brand" href="/">Naturverse</Link>

        <nav className="nv-links">
          <Link className="nv-link" href="/worlds">Worlds</Link>
          <Link className="nv-link" href="/zones">Zones</Link>
          <Link className="nv-link" href="/marketplace">Marketplace</Link>
          <Link className="nv-link" href="/wishlist">Wishlist</Link>
          <Link className="nv-link" href="/naturversity">Naturversity</Link>
          <Link className="nv-link" href="/naturbank">NaturBank</Link>
          {authed ? (
            <Link className="nv-link" href="/navatar">Navatar</Link>
          ) : (
            <a
              href="#"
              aria-disabled
              className="nv-link is-disabled"
              onClick={(e) => e.preventDefault()}
            >
              Navatar
            </a>
          )}
          <Link className="nv-link" href="/passport">Passport</Link>
          <Link className="nv-link" href="/turian">Turian</Link>
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
