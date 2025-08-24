import React, { useState } from "react";

type Props = Omit<JSX.IntrinsicElements["img"], "onError" | "loading"> & {
  fallbackSrc?: string;
};

export default function ImageSafe({ fallbackSrc = "/assets/placeholder.svg", ...rest }: Props) {
  const [src, setSrc] = useState(rest.src);
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...rest}
      src={src}
      loading="lazy"
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}
