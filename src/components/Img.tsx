import React, { useState } from "react";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function Img({
  src,
  alt,
  fallbackSrc = "/placeholder.png",
  ...rest
}: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {!loaded && (
        <div
          style={{
            width: rest.width || "100%",
            height: rest.height || "200px",
            background: "rgba(0,0,0,0.05)",
            borderRadius: "8px",
            animation: "pulse 1.5s infinite"
          }}
        />
      )}

      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          display: loaded ? "block" : "none",
          width: rest.width || "100%",
          height: rest.height || "auto",
          borderRadius: "8px"
        }}
        {...rest}
      />

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

