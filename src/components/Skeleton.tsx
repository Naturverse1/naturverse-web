import React from "react";
import "./skeleton.css";

type Props = {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export default function Skeleton({ width = "100%", height = 16, circle = false, style, className }: Props) {
  const styles: React.CSSProperties = {
    width,
    height,
    borderRadius: circle ? "9999px" : 10,
    ...style,
  };
  return <span className={`nv-skel ${className ?? ""}`} style={styles} aria-hidden="true" />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="nv-skel-stack" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} style={{ marginBottom: 10, width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="nv-skel-card" aria-hidden="true">
      <Skeleton height={160} style={{ marginBottom: 12 }} />
      <SkeletonText lines={2} />
    </div>
  );
}

