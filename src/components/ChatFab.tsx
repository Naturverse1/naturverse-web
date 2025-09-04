import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ChatFab({ className = '', children, ...props }: Props) {
  return (
    <button
      type="button"
      className={`brand-fab fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

