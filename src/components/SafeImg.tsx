import React, { useState } from "react";

export default function SafeImg(
  { src, alt, width, height, className }: { src: string; alt: string; width?: number; height?: number; className?: string }
) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return <div className={`img-fallback ${className || ""}`} style={{ width, height }} aria-label={alt} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setErr(true)}
      className={className}
    />
  );
}
