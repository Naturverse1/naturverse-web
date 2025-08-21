import { useNavigate, Link } from "react-router-dom";
import "./backbar.css";

export default function BackBar({ title }: { title?: string }) {
  const nav = useNavigate();
  return (
    <div className="nv-backbar">
      <button type="button" className="nv-backbar__btn" onClick={() => nav(-1)} aria-label="Back">←</button>
      <Link to="/" className="nv-backbar__home" aria-label="Home">🏠</Link>
      {title && <span className="nv-backbar__title">{title}</span>}
    </div>
  );
}

