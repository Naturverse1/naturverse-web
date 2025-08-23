import React from "react";
import ImageSmart from "./ImageSmart";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string; // optional tooltip/accessible label
};

/** Turian Media mark as an inline, responsive img (no link). */
export default function BrandMark({
  size = "md",
  className = "",
  title = "Turian Media Company",
}: Props) {
  const h =
    size === "sm" ? 18 :
    size === "lg" ? 36 : 28;

  return (
    <span className={`brand-mark ${className}`} aria-label={title}>
      <ImageSmart
        src="/turianmedialogo.png"
        alt=""
        role="presentation"
        className="brand-logo"
        style={{ height: h, width: "auto", objectFit: "contain" }}
      />
      <span className="sr-only">{title}</span>
    </span>
  );
}
