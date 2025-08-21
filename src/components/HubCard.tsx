import { Link } from 'react-router-dom';

type HubCardProps = {
  to: string;
  emoji: string;
  title: string;
  sub?: string;
};

export default function HubCard({ to, emoji, title, sub }: HubCardProps) {
  return (
    <Link to={to} className="hub-card" aria-label={`${title}${sub ? ` – ${sub}` : ''}`}>
      <div className="hub-title">
        <span className="hub-emoji" aria-hidden>
          {emoji}
        </span>
        <span>{title}</span>
      </div>
      {sub ? <div className="hub-sub">{sub}</div> : null}
    </Link>
  );
}
