import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import "./navatarPage.css";
import { Link } from "react-router-dom";

export default function Mint() {
  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Mint your Navatar as an NFT</h1>
      <Breadcrumbs items={[{href:"/",label:"Home"},{href:"/navatar",label:"Navatar"},{label:"NFT / Mint"}]} />
      <NavatarTabs/>
      <p className="nv-help">Coming soon. In the meantime, make merch with your Navatar.</p>
      <Link to="/marketplace" className="primary">Marketplace</Link>
    </div>
  );
}
