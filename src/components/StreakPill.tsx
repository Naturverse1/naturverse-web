import type { CSSProperties } from 'react';

type StreakPillProps = {
  count: number;
};

const pillStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '999px',
  backgroundColor: '#fef08a',
  color: '#854d0e',
  fontWeight: 700,
  fontSize: '0.85rem',
};

export default function StreakPill({ count }: StreakPillProps) {
  if (!Number.isFinite(count) || count <= 0) return null;
  return (
    <span style={pillStyle}>
      <span aria-hidden="true">🔥</span>
      <span>{Math.floor(count)}-day streak!</span>
    </span>
  );
}
