import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { Link } from "react-router-dom";
import "./navatarPage.css";

export default function NavatarMarket() {
  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Marketplace</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"Marketplace"}]} />
      <NavatarTabs/>
      <p className="nv-help">Create plushies, tees and more with your Navatar.</p>
      <Link to="/marketplace" className="primary">Open Marketplace</Link>
    </div>
  );
}
