import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { useAuth } from '../hooks/useAuth'
import { SITE } from '@/lib/site'

export default function Header() {
  const { user, loading } = useAuth()
  if (!user) return null

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/">🌿 {SITE.name}</Link>
      </div>

      <nav className={styles.nav}>
        <Link to="/worlds">Worlds</Link>
        <Link to="/zones">Zones</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/naturversity">Naturversity</Link>
        <Link to="/naturbank">NaturBank</Link>
        <Link to="/navatar">Navatar</Link>
        <Link to="/passport">Passport</Link>
        <Link to="/turian">Turian</Link>
        <Link to="/cart" aria-label="Cart">🛒</Link>
      </nav>
    </header>
  )
}
