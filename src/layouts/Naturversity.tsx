import { Outlet } from "react-router-dom";
import "../styles/naturversity.css";

export default function NaturversityLayout() {
  return (
    <div className="nvrs-naturversity naturversity-page">
      <Outlet />
    </div>
  );
}
