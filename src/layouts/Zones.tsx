import { Outlet } from "react-router-dom";
import "../styles/zones.css";
import ZonesBlueScope from "../components/ZonesBlueScope";

export default function ZonesLayout() {
  return (
    <ZonesBlueScope>
      <div className="nvrs-zones">
        <Outlet />
      </div>
    </ZonesBlueScope>
  );
}
