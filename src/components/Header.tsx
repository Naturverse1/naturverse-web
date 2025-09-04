import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { useAuth } from '../hooks/useAuth'
import { BRAND_NAME } from '@/lib/brand'

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/">🌿 {BRAND_NAME}</Link>
      </div>

      {!loading && user && (
        <nav className={styles.nav}>
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
          <Link to="/cart" aria-label="Cart">🛒</Link>
        </nav>
      )}
    </header>
  )
}
