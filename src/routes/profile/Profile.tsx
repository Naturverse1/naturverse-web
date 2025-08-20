import { Link, Outlet, useLocation } from "react-router-dom";
export default function Profile(){
  const { pathname } = useLocation();
  const index = pathname.endsWith("/profile") || pathname === "/profile";
  return (
    <>
      <h2>Profile & Settings</h2>
      <div className="pillbar">
        <Link className="pill" to="/profile/settings">Settings</Link>
        <Link className="pill" to="/profile/orders">Orders</Link>
      </div>
      {index ? <p className="muted">Manage your account.</p> : <Outlet />}
    </>
  );
}
