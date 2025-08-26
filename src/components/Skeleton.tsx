export function Skeleton({ h=16, w="100%", r=10 }:{h?:number; w?:number|string; r?:number}) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, #eef3ff 25%, #f6f9ff 37%, #eef3ff 63%)",
      backgroundSize: "400% 100%", animation: "nv-shimmer 1.2s ease-in-out infinite"
    }}/>
  );
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "white", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
      <Skeleton h={180} r={12}/>
      <div style={{ height: 12 }} />
      <Skeleton h={18} w="70%"/>
      <div style={{ height: 10 }} />
      <Skeleton h={14} w="55%"/>
    </div>
  );
}

/* Global keyframes (inject once) */
if (!document.getElementById("nv-shimmer-style")) {
  const s = document.createElement("style");
  s.id = "nv-shimmer-style";
  s.textContent = `
  @keyframes nv-shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }`;
  document.head.appendChild(s);
}
