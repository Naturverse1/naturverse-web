import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './mobile-menu.module.css';

type Props = { id?: string; open: boolean; onClose: () => void };

export default function MobileMenu({ id, open, onClose }: Props) {
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const close = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.scrim === '1') onClose();
  };

  return (
    <div className={styles.scrim} data-scrim="1" onClick={close}>
      <div className={styles.sheet} id={id} role="dialog" aria-modal="true">
        <button className={styles.close} aria-label="Close" onClick={onClose}>
          ×
        </button>
        <nav className={styles.menu} aria-label="Mobile">
          <Link to="/worlds" onClick={onClose}>Worlds</Link>
          <Link to="/zones" onClick={onClose}>Zones</Link>
          <Link to="/marketplace" onClick={onClose}>Marketplace</Link>
          <Link to="/wishlist" onClick={onClose}>Wishlist</Link>
          <Link to="/naturversity" onClick={onClose}>Naturversity</Link>
          <Link to="/naturbank" onClick={onClose}>NaturBank</Link>
          <Link to="/navatar" onClick={onClose}>Navatar</Link>
          <Link to="/passport" onClick={onClose}>Passport</Link>
          <Link to="/turian" onClick={onClose}>Turian</Link>
        </nav>
      </div>
    </div>
  );
}
