import { Container } from "./Container";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">&copy; 2025 Turian Media Company</p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="https://x.com/TuriantheDurian" target="_blank" rel="noreferrer">X</a>
          <a href="https://instagram.com/turianthedurian" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://tiktok.com/@turianthedurian" target="_blank" rel="noreferrer">TikTok</a>
          <a href="https://youtube.com/@TuriantheDurian" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://facebook.com/TurianMediaCompany" target="_blank" rel="noreferrer">Facebook</a>
        </nav>
      </Container>
    </footer>
  );
}

