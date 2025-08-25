'use client';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import NavbarRight from './NavbarRight';

export default function NavBar() {
  return (
    <header className={styles.wrap}>
      <Link to="/" className={styles.brand}>🌿 Naturverse</Link>
      {/* Right side icons render only when authenticated; no empty placeholder */}
      <NavbarRight />
    </header>
  );
}
