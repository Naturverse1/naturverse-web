import React from 'react';

// simple badge component with tone variants
interface Props {
  children: React.ReactNode;
  tone?: 'default' | 'success' | 'info' | 'muted';
}

export default function Badge({ children, tone = 'default' }: Props) {
  const cls =
    tone === 'success'
      ? 'badge badge--success'
      : tone === 'info'
        ? 'badge badge--info'
        : tone === 'muted'
          ? 'badge badge--muted'
          : 'badge';
  return <span className={cls}>{children}</span>;
}
