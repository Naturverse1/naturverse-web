import React from "react";
import SafeImg from "./SafeImg";

const isActive = (href: string) => typeof window !== "undefined" && window.location.pathname === href;

export default function Nav() {
  return (
    <>
        <nav className="topnav container">
          <a href="/" aria-label="Naturverse Home" className={`toplink brand ${isActive("/") ? "active" : ""}`}>
            <SafeImg src="/favicon-32x32.png" alt="Naturverse" width={24} height={24} />
          </a>
          <div className="links">
            <a href="/worlds" className={`toplink ${isActive("/worlds") ? "active" : ""}`}>Worlds</a>
            <a href="/zones" className={`toplink ${isActive("/zones") ? "active" : ""}`}>Zones</a>
            <a href="/marketplace" className={`toplink ${isActive("/marketplace") ? "active" : ""}`}>Marketplace</a>
            <a href="/naturversity" className={`toplink ${isActive("/naturversity") ? "active" : ""}`}>Naturversity</a>
            <a href="/naturbank" className={`toplink ${isActive("/naturbank") ? "active" : ""}`}>NaturBank</a>
            <a href="/navatar" className={`toplink ${isActive("/navatar") ? "active" : ""}`}>Navatar</a>
            <a href="/passport" className={`toplink ${isActive("/passport") ? "active" : ""}`}>Passport</a>
            <a href="/turian" className={`toplink ${isActive("/turian") ? "active" : ""}`}>Turian</a>
            <a href="/profile" className={`toplink ${isActive("/profile") ? "active" : ""}`}>Profile</a>
          </div>
        </nav>
      </>
    );
  }
