import React from "react";

/**
 * Drop-in <img> replacement with safe perf defaults.
 * - lazy loads by default
 * - async decodes
 * - lets you opt-in to hero priority
 * - never changes layout (you control size via className or width/height)
 */
type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean; // set true for above-the-fold/hero only
  fetchPriority?: "auto" | "high" | "low";
};

export default function ImageSmart({ priority, loading, decoding, fetchPriority, ...rest }: Props) {
  const isHero = Boolean(priority);
  return (
    <img
      loading={loading ?? (isHero ? "eager" : "lazy")}
      decoding={decoding ?? (isHero ? "sync" : "async")}
      // helps browsers schedule fetches; ignored by older ones (safe)
      fetchPriority={fetchPriority ?? (isHero ? "high" : "low")}
      // pass everything else through (src, alt, width, height, className, etc.)
      {...rest}
    />
  );
}
