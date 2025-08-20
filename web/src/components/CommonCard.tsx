export default function CommonCard({title,children,onClick}:{title:string;children?:any;onClick?:()=>void}) {
  return (
    <div
      className="card"
      role="button"
      onClick={onClick}
      style={{padding:'12px',border:'1px solid #ddd',borderRadius:8,marginBottom:12}}
    >
      <h3 style={{margin:'0 0 6px'}}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
