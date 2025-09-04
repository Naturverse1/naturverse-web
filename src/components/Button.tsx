import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
};

export default function Button({ className = '', variant = 'brand', ...rest }: Props) {
  const base =
    variant === 'brand'
      ? 'bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md'
      : '';
  return <button className={`${base} ${className}`} data-variant={variant} {...rest} />;
}

