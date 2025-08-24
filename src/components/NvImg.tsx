import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  width: number;   // intrinsic px width
  height: number;  // intrinsic px height
};

export default function NvImg({ width, height, style, loading = "lazy", decoding = "async", ...rest }: Props) {
  const ratio = (height / width) * 100;
  return (
    <div className="nvimg" style={{ position: "relative", width: "100%", paddingTop: `${ratio}%` }}>
      <img
        {...rest}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 12,
          ...style,
        }}
      />
    </div>
  );
}

