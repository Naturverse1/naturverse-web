import { Link } from "react-router-dom";

type HubCardProps = {
  to: string;
  title: string;
  desc: string;
  emoji?: string;
  className?: string;
};

export function HubCard({ to, title, desc, emoji, className = "" }: HubCardProps) {
  return (
    <Link to={to} className={"block rounded-xl border p-4 hover:bg-gray-50 " + className}>
      <div className="text-lg font-semibold">
        {emoji ? <span className="mr-2">{emoji}</span> : null}
        {title}
      </div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </Link>
  );
}
