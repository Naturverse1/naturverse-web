import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/** Lightweight lazy image with native lazy-loading and aspect-ratio safety. */
export default function LazyImage({ style, ...rest }: Props) {
  return (
    <img
      loading="lazy"
      decoding="async"
      {...rest}
      style={{ imageRendering: "auto", ...style }}
    />
  );
}
