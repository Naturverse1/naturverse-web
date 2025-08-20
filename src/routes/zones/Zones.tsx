import { Link, Outlet, useLocation } from "react-router-dom";

const links = [
  ["music","Music"],
  ["wellness","Wellness"],
  ["creator-lab","Creator Lab"],
  ["community","Community"],
  ["teachers","Teachers"],
  ["partners","Partners"],
  ["naturversity","Naturversity"],
  ["parents","Parents"],
  ["navatar","Navatar Creator"],
];

export default function Zones() {
  const { pathname } = useLocation();
  const isIndex = pathname.endsWith("/zones") || pathname === "/zones";
  return (
    <>
      <h2>Zones</h2>
      <div className="pillbar">
        {links.map(([slug, label]) => (
          <Link key={slug} className="pill" to={`/zones/${slug}`}>{label}</Link>
        ))}
      </div>
      {isIndex ? <p className="muted">Choose a zone above.</p> : <Outlet />}
    </>
  );
}
