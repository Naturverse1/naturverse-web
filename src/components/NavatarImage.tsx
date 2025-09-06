import React from 'react';

export default function NavatarImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="navatar-frame">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
