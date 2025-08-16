export default function Header() {
  return (
    <header style={{display:"flex",alignItems:"center",gap:16,padding:"12px 16px"}}>
      <a href="/" style={{color:"#eaf2ff",textDecoration:"none",fontWeight:700}}>Naturverse</a>
      <nav style={{display:"flex",gap:12,marginLeft:"auto"}}>
        <a href="/map">Map</a>
        <a href="/login">Sign in</a>
      </nav>
    </header>
  );
}
