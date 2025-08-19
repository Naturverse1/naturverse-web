import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  const link = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-md text-sm font-medium " +
    (isActive ? "bg-gray-200" : "hover:bg-gray-100");
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Naturverse
        </Link>
        <div className="flex space-x-2">
          <NavLink to="/" end className={link}>
            Home
          </NavLink>
          <NavLink to="/worlds" className={link}>
            Worlds
          </NavLink>
          <NavLink to="/zones" className={link}>
            Zones
          </NavLink>
          <NavLink to="/arcade" className={link}>
            Arcade
          </NavLink>
          <NavLink to="/marketplace" className={link}>
            Marketplace
          </NavLink>
          <NavLink to="/music" className={link}>
            Music
          </NavLink>
          <NavLink to="/wellness" className={link}>
            Wellness
          </NavLink>
          <NavLink to="/creators-lab" className={link}>
            Creator Lab
          </NavLink>
          <NavLink to="/teachers" className={link}>
            Teachers
          </NavLink>
          <NavLink to="/partners" className={link}>
            Partners
          </NavLink>
          <NavLink to="/turian-tips" className={link}>
            Turian Tips
          </NavLink>
          <NavLink to="/profile" className={link}>
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
