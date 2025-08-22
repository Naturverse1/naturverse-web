import React from "react";
export function Skeleton({ w="100%", h=140, r=12 }:{ w?:number|string; h?:number; r?:number }) {
  return <div className="skeleton" style={{width:w,height:h,borderRadius:r}}/>;
}
