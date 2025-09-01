import React from 'react';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/lib/auth-context';

export default function MobileNav({
  open,
  onClose,
  onCartOpen,
}: {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
}) {
  const { user } = useAuth();

  return (
    <div
      id="nv-mobile-menu"
      className={`nv-mobile-menu ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="sheet pointer-events-auto z-50" onClick={(e) => e.stopPropagation()}>
        <button
          className="nv-icon-btn close hover:opacity-80 transition-opacity"
          aria-label="Close menu"
          onClick={onClose}
        >
          ×
        </button>

        <nav
          aria-label="Mobile"
          className="flex flex-col gap-3 px-4 py-4 pb-[env(safe-area-inset-bottom)]"
        >
          <a href="/worlds" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Worlds
          </a>
          <a href="/zones" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Zones
          </a>
          <a href="/marketplace" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Marketplace
          </a>
          <a href="/wishlist" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Wishlist
          </a>
          <a href="/naturversity" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Naturversity
          </a>
          <a href="/naturbank" onClick={onClose} className="hover:opacity-80 transition-opacity">
            NaturBank
          </a>
          <a href="/navatar" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Navatar
          </a>
          <a href="/passport" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Passport
          </a>
          <a href="/turian" onClick={onClose} className="hover:opacity-80 transition-opacity">
            Turian
          </a>

          {user ? (
            <div className="flex items-center gap-3 mt-4">
              <CartButton
                className="nv-icon-btn hover:opacity-80 transition-opacity"
                onClick={() => {
                  onCartOpen();
                  onClose();
                }}
              />
              <UserAvatar className="nv-icon-btn hover:opacity-80 transition-opacity" />
            </div>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
