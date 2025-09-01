import { useEffect } from 'react';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/lib/auth-context';
import { useLocation } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
}

export default function MobileNav({ open, onClose, onCartOpen }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  if (!open) return null;

  return (
    <div
      id="nv-mobile-menu"
      className={`nv-mobile-menu ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="sheet flex flex-col gap-3 px-4 py-4 pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="nv-icon-btn close"
          aria-label="Close menu"
          onClick={onClose}
        >
          ×
        </button>

        {user && (
          <div className="flex gap-3">
            <UserAvatar className="nv-icon-btn" />
            <CartButton
              className="nv-icon-btn"
              onClick={() => {
                onCartOpen();
                onClose();
              }}
            />
          </div>
        )}

        <nav aria-label="Mobile">
          <a href="/worlds">Worlds</a>
          <a href="/zones">Zones</a>
          <a href="/marketplace">Marketplace</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/naturversity">Naturversity</a>
          <a href="/naturbank">NaturBank</a>
          <a href="/navatar">Navatar</a>
          <a href="/passport">Passport</a>
          <a href="/turian">Turian</a>
        </nav>
      </div>
    </div>
  );
}

