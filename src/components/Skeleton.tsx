export default function Skeleton({h=16}:{h?:number}) {
  return <div style={{
    height:h, width:'100%', borderRadius:8,
    background:'linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)',
    backgroundSize:'400% 100%', animation:'nvshine 1.4s ease infinite'
  }}>
    <style>{`@keyframes nvshine{0%{background-position:100% 0}100%{background-position:0 0}}`}</style>
  </div>
}
