import { Link } from 'react-router-dom';

type HubCardProps = {
  to: string;
  emoji: string;
  title: string;
  sub?: string;
};

export default function HubCard({ to, emoji, title, sub }: HubCardProps) {
  return (
    <Link to={to} className="hub-card card" aria-label={`${title}${sub ? ` – ${sub}` : ''}`}>
      <strong className="hub-card-title card-title">
        <span className="hub-ico emoji" aria-hidden>
          {emoji}
        </span>
        {title}
      </strong>
      {sub ? <div className="hub-sub">{sub}</div> : null}
    </Link>
  );
}
