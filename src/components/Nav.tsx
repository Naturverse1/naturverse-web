import React from "react";
import { NavLink } from "react-router-dom";
import ImageSmart from "./ImageSmart";

export default function Nav() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="topnav container">
        <a href="/" aria-label="Naturverse Home" className="brand">
          <ImageSmart src="/favicon-32x32.png" alt="Naturverse" width={24} height={24} priority />
        </a>
        <div className="links">
          <NavLink to="/worlds" className={({isActive})=>`nav${isActive?' active':''}`}>Worlds</NavLink>
          <NavLink to="/zones" className={({isActive})=>`nav${isActive?' active':''}`}>Zones</NavLink>
          <NavLink to="/marketplace" className={({isActive})=>`nav${isActive?' active':''}`}>Marketplace</NavLink>
          <NavLink to="/naturversity" className={({isActive})=>`nav${isActive?' active':''}`}>Naturversity</NavLink>
          <NavLink to="/passport" className={({isActive})=>`nav${isActive?' active':''}`}>Passport</NavLink>
          {/* ...rest unchanged */}
        </div>
      </nav>
    </>
  );
}
