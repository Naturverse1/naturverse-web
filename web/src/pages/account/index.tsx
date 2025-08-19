import React from "react";
import { Link } from "react-router-dom";

export default function Account() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>👤 Account</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li><Link to="/account/orders">Orders</Link></li>
        <li><Link to="/account/addresses">Addresses</Link></li>
        <li><Link to="/account/wishlist">Wishlist</Link></li>
      </ul>
    </main>
  );
}

