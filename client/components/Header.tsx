import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="nv-header">
      <div className="nv-header__inner">
        {/* Clickable brand → Home restored */}
        <Link to="/" aria-label="Naturverse Home"><span style={{fontSize:20}}>🌿</span> <strong>Naturverse</strong></Link>
        <nav className="top-inline-nav" style={{marginLeft:"auto", gap:14, flexWrap:"wrap"}}>
          {[
            ["/worlds","Worlds"],
            ["/zones","Zones"],
            ["/marketplace","Marketplace"],
            ["/naturversity","Naturversity"],
            ["/naturbank","Naturbank"],
            ["/navatar","Navatar"],
            ["/passport","Passport"],
            ["/turian","Turian"],
            ["/profile","Profile"],
          ].map(([to,label])=> (
            <NavLink key={to} to={to} className={({isActive})=>isActive?"active":undefined}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

