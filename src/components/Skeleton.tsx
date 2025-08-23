import React from "react";

export function SkeletonLine({ w="100%", h=14 }: { w?: number|string, h?: number }) {
  return <div className="sk-line" style={{width:w, height:h}} />;
}

export function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-thumb" />
      <div className="sk-body">
        <div className="sk-line" style={{width:"60%"}} />
        <div className="sk-line" style={{width:"90%"}} />
      </div>
    </div>
  );
}
