import { Link, Outlet, useLocation } from "react-router-dom";

export default function Arcade() {
  const { pathname } = useLocation();
  const isIndex = pathname.endsWith("/arcade") || pathname === "/arcade";
  return (
    <>
      <h2>Arcade</h2>
      <div className="cards">
        <li className="card"><Link className="card-link" to="snake"><div className="card-emoji">🐍</div><div><div className="card-title">Snake</div><div className="card-sub">Collect fruit, avoid walls.</div></div></Link></li>
        <li className="card"><Link className="card-link" to="memory"><div className="card-emoji">🧠</div><div><div className="card-title">Memory</div><div className="card-sub">Flip and match cards.</div></div></Link></li>
        <li className="card"><Link className="card-link" to="typing"><div className="card-emoji">⌨️</div><div><div className="card-title">Typing</div><div className="card-sub">Speed & accuracy.</div></div></Link></li>
      </div>
      {!isIndex && <Outlet />}
    </>
  );
}
