import React from "react";

export default function NavatarImage({
  src,
  alt,
  maxHeight = 440,
}: { src?: string | null; alt?: string; maxHeight?: number }) {
  return (
    <div className="nv-image-frame" style={{ maxHeight }}>
      {/* Use <img> so object-fit is respected everywhere */}
      <img className="nv-image" src={src ?? ""} alt={alt ?? "Navatar"} />
    </div>
  );
}
