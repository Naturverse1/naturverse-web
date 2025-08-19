import React from "react";
import WishlistButton from "../../components/WishlistButton";

export default function Wishlist() {
  return (
    <main style={{ maxWidth: 820, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>⭐ Wishlist</h2>
      <p>Items you’ve saved for later.</p>
      <WishlistButton productId="demo-1" />
    </main>
  );
}

