import { ImgHTMLAttributes, useState } from "react";
import cn from "../utils/cn";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export default function LazyImage({ className, onLoad, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      loading="lazy"
      decoding="async"
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(
        "nv-img",
        loaded ? "nv-img--ready" : "nv-img--blur",
        className
      )}
      {...props}
    />
  );
}

