import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <h1 style={{marginBottom:8}}>✨ Welcome to the Naturverse™</h1>
      <p>Pick a hub to begin your adventure.</p>
      <div className="card-grid" style={{marginTop:16}}>
        <Link className="card" to="/worlds">📚 <strong>Worlds</strong><br/>Travel the 14 magical kingdoms.</Link>
        <Link className="card" to="/zones">🎮 🎵 🧘 <strong>Zones</strong><br/>Arcade, Music, Wellness, Creator Lab, Stories, Quizzes.</Link>
        <Link className="card" to="/marketplace">🛍️ <strong>Marketplace</strong><br/>Wishlists, catalog, checkout.</Link>
        <Link className="card" to="/naturversity">🎓 <strong>Naturversity</strong><br/>Teachers, partners, and courses.</Link>
        <Link className="card" to="/naturbank">🪙 <strong>Naturbank</strong><br/>Wallets, NATUR token, and crypto basics.</Link>
        <Link className="card" to="/navatar">❎ <strong>Navatar</strong><br/>Create your character.</Link>
        <Link className="card" to="/passport">📘 <strong>Passport</strong><br/>Track stamps, badges, XP & coins.</Link>
        <Link className="card" to="/turian">🟢 <strong>Turian</strong><br/>Guide for tips & quests.</Link>
        <Link className="card" to="/profile">👤 <strong>Profile</strong><br/>Your account & saved navatar.</Link>
      </div>
    </div>
  );
}

