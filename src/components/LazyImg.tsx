import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { alt: string };

export default function LazyImg(props: Props) {
  return <img loading="lazy" {...props} />;
}
