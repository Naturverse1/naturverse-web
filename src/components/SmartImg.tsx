import React, { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  rounded?: boolean;
  ratio?: "square" | "wide" | "tall"; // visual placeholder box
};

export default function SmartImg({ rounded = true, ratio = "wide", className = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  const width = rest.width ?? 800;
  const height = rest.height ?? 450;
  return (
    <div className={`smartimg ${ratio} ${rounded ? "rounded" : ""} ${loaded ? "is-loaded" : ""}`}>
      <img
        {...rest}
        loading={rest.loading ?? "lazy"}
        width={width}
        height={height}
        onLoad={(e) => {
          rest.onLoad?.(e as any);
          setLoaded(true);
        }}
        className={`smartimg-img ${className}`}
      />
      {!loaded && <div className="smartimg-skel" />}
    </div>
  );
}
