import React from "react";

/**
 * Lightweight image helper with safe defaults:
 * - lazy loads by default
 * - async decoding
 * - optional width/height to avoid CLS
 * - supports placeholders via `placeholder` prop
 */
export type NVImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "loading" | "decoding"
> & {
  /**
   * If true, image will use loading="eager" and fetchpriority="high".
   * Use ONLY for above-the-fold hero art.
   */
  priority?: boolean;
  /** Low-res placeholder data URL or tiny SVG; optional */
  placeholder?: string;
};

export default function NVImage({
  priority = false,
  placeholder,
  src,
  srcSet,
  sizes,
  alt = "",
  className,
  style,
  ...rest
}: NVImageProps) {
  const props: React.ImgHTMLAttributes<HTMLImageElement> = {
    src,
    srcSet,
    sizes,
    alt,
    className: className ? `nv-img ${className}` : "nv-img",
    style,
    decoding: "async",
    loading: priority ? "eager" : "lazy",
    // @ts-expect-error: fetchpriority is a valid HTML attribute
    fetchpriority: priority ? "high" : undefined,
    ...rest,
  };

  // If a placeholder is provided, show it until load.
  const [loaded, setLoaded] = React.useState(!placeholder);
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    rest.onLoad?.(e);
  };

  return (
    <span className={`nv-img-wrap${loaded ? " is-loaded" : ""}`} style={{ display: "inline-block", position: "relative" }}>
      {placeholder && !loaded && (
        <img
          aria-hidden="true"
          alt=""
          className="nv-img nv-img--placeholder"
          src={placeholder}
          decoding="async"
          loading="eager"
          style={{ filter: "blur(8px)", transform: "scale(1.02)" }}
        />
      )}
      <img {...props} onLoad={onLoad} />
    </span>
  );
}

