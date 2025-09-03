import styles from './NavBar.module.css';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className={`${styles.links} nv-desktop-nav`} aria-label="Primary">
      <a href="/worlds">Worlds</a>
      <a href="/zones">Zones</a>
      <a href="/marketplace">Marketplace</a>
      <a href="/marketplace/wishlist">Wishlist</a>
      <a href="/naturversity">Naturversity</a>
      <a href="/naturbank">NaturBank</a>
      <a href="/navatar">Navatar</a>
      <a href="/passport">Passport</a>
      <a href="/turian">Turian</a>
    </nav>
  );
}
