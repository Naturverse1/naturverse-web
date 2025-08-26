import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  previewSrc?: string; // low-res or data URL (optional)
  className?: string;
  onLoad?: () => void;
};

export default function LazyImage({
  src, alt, width = "100%", height = "100%", previewSrc, className, onLoad
}: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Load immediately if IntersectionObserver unsupported
    if (!("IntersectionObserver" in window)) { el.src = src; return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { el.src = src; obs.disconnect(); }
      });
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <div style={{ position: "relative", width, height }} className={className}>
      {!loaded && (
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: 12,
            background: previewSrc
              ? `center / cover no-repeat url(${previewSrc})`
              : "linear-gradient(90deg,#eef3ff 25%,#f7faff 50%,#eef3ff 75%)",
            animation: previewSrc ? undefined : "nv-shimmer 1.2s infinite",
            filter: previewSrc ? "blur(14px)" : undefined
          }}
        />
      )}
      {!err ? (
        <img
          ref={ref}
          alt={alt}
          loading="lazy"
          onLoad={() => { setLoaded(true); onLoad?.(); }}
          onError={() => setErr(true)}
          style={{
            width: "100%", height: "100%", objectFit: "cover", borderRadius: 12,
            opacity: loaded ? 1 : 0, transition: "opacity .28s ease"
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            color: "#6c7aa1", background: "#f0f5ff", borderRadius: 12, fontSize: 12
          }}
        >image unavailable</div>
      )}
    </div>
  );
}
