import { Outlet } from "react-router-dom";
import "../../app/styles/zones.css";

export default function ZonesLayout() {
  return (
    <div className="nvrs-zones">
      <Outlet />
    </div>
  );
}
