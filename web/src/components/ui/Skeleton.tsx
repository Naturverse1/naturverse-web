import React from 'react';

interface Props {
  className?: string;
}

export function Skeleton({ className }: Props) {
  return <div className={`skeleton ${className || ''}`.trim()} />;
}

export function TextSkeleton({ className, width }: Props & { width?: string | number }) {
  return (
    <div
      className={`skeleton ${className || ''}`.trim()}
      style={{ width, height: '1em' }}
    />
  );
}
