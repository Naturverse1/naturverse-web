import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  srcPng?: string; srcWebp?: string;
  fallback?: string;
};
export function Img({ src, srcPng, srcWebp, fallback="/placeholders/image-missing.jpg", alt="", ...rest }: Props) {
  const png = (srcPng ?? (src as string)) || "";
  const webp = srcWebp;
  return webp ? (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img loading="lazy" decoding="async" src={png} alt={alt} onError={(e)=>{(e.currentTarget as HTMLImageElement).src = fallback!;}} {...rest}/>
    </picture>
  ) : (
    <img loading="lazy" decoding="async" src={png} alt={alt} onError={(e)=>{(e.currentTarget as HTMLImageElement).src = fallback!;}} {...rest}/>
  );
}
