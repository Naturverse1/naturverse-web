import React from 'react';

type Props = { svg?: string; url?: string; size?: number; alt?: string };
export default function NavatarBadge({ svg, url, size = 28, alt = 'Navatar' }: Props) {
  if (url) return <img src={url} width={size} height={size} alt={alt} style={{ borderRadius: '50%' }} />;
  if (!svg) return <div style={{ width: size, height: size, borderRadius: '50%', background: '#e6f2ff' }} />;
  return (
    <span
      aria-label={alt}
      style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
