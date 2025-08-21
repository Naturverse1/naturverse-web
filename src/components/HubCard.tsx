import { ReactNode } from "react";

type HubCardProps = {
  title: string;
  desc: string;
  emoji?: string;
  footer?: ReactNode;
};

export function HubCard({ title, desc, emoji, footer }: HubCardProps) {
  return (
    <div className="rounded-xl border p-4 bg-white/70">
      <div className="text-lg font-semibold">
        {emoji ? <span className="mr-2">{emoji}</span> : null}
        {title}
      </div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}
