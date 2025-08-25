import * as React from 'react';

type Props = {
  emoji?: string | null;
  size?: number; // px
  title?: string;
};

export default function ProfileHead({ emoji = '🙂', size = 28, title = 'Profile' }: Props) {
  return (
    <div
      title={title}
      aria-label={title}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.68),
        lineHeight: 1,
        background: '#fff',
        boxShadow: '0 2px 0 rgba(0,0,0,.1)',
        border: '1px solid #e6e9f0',
      }}
    >
      <span style={{ transform: 'translateY(1px)' }}>{emoji}</span>
    </div>
  );
}
