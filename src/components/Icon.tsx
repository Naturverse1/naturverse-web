import * as React from 'react';

type IconName = 'home' | 'world' | 'market' | 'contact' | 'menu' | 'cart' | 'arrow';

export default function Icon({
  name,
  size = 20,
  title,
  className = 'a-accent',
}: {
  name: IconName;
  size?: number;
  title?: string;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : 'presentation',
    className,
  } as const;

  switch (name) {
    case 'home':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M12 3 3 10h2v10h6V14h2v6h6V10h2L12 3z" />
        </svg>
      );
    case 'world':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.7 0 3.2 3.1 3.7 6H8.3c.5-2.9 2-6 3.7-6zm-4 8c0 .7.1 1.3.2 2h7.6c.1-.7.2-1.3.2-2s-.1-1.3-.2-2H8.2c-.1.7-.2 1.3-.2 2zm.6 4h6.8c-.8 2.6-2.2 4-3.4 4s-2.6-1.4-3.4-4z" />
        </svg>
      );
    case 'market':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M7 4h-2l-1 2H1v2h2l3.6 7.6A2 2 0 0 0 8.4 17h7.2a2 2 0 0 0 1.8-1.2L21 8H6.2l-.6-2H22V4H7zM8 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 16 19z" />
        </svg>
      );
    case 'contact':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-9 9c0-4 5-6 9-6s9 2 9 6v1H3v-1z" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
        </svg>
      );
    case 'cart':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 6h15l-2 8H8L6 6zM3 4h2l3.6 10H19v2H7.4a2 2 0 0 1-1.9-1.3L2 4z" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common} fill="currentColor">
          {title ? <title>{title}</title> : null}
          <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2L11.6 6.4 13 5z" />
        </svg>
      );
  }
}
