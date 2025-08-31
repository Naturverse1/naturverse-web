import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.copy}>© 2025 Turian Media Company</div>

        <nav className={styles.links} aria-label="Utility">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="https://x.com/TuriantheDurain" target="_blank" rel="noreferrer">X</a>
          <a href="https://instagram.com/turianthedurian" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://tiktok.com/@turian.the.durian" target="_blank" rel="noreferrer">TikTok</a>
          <a href="https://youtube.com/@TuriantheDurian" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://facebook.com/TurianMediaCompany" target="_blank" rel="noreferrer">Facebook</a>
        </nav>
      </div>
    </footer>
  )
}

