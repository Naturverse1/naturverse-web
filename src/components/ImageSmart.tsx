import React from "react";

/**
 * Drop-in <img> replacement with safe performance defaults.
 * - Lazy loads by default
 * - Async decodes
 * - Allows opt-in priority for hero/above-fold images
 */
type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
  fetchpriority?: "auto" | "high" | "low";
};

export default function ImageSmart({ priority, loading, decoding, fetchPriority, fetchpriority, ...rest }: Props) {
  const isHero = Boolean(priority);
  const fp = fetchPriority ?? fetchpriority ?? (isHero ? "high" : "low");
  return (
    <img
      loading={loading ?? (isHero ? "eager" : "lazy")}
      decoding={decoding ?? (isHero ? "sync" : "async")}
      fetchPriority={fp}
      {...rest}
    />
  );
}
