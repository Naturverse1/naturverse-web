import React from 'react';

export default function AvatarPlaceholder({ title = 'No photo' }: { title?: string }) {
  // Inline SVG (no binary asset)
  return (
    <div
      aria-label={title}
      style={{
        width: '100%',
        aspectRatio: '3/4',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 16,
        background: 'linear-gradient(180deg,#f5f8ff,#eef3ff)',
        border: '1px solid #e3e9ff',
        color: '#94a3b8',
        fontWeight: 700,
      }}
    >
      {title}
    </div>
  );
}
