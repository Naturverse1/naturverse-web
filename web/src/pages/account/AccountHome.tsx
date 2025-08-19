import { Link } from "react-router-dom";

export default function AccountHome() {
  return (
    <section>
      <h2>Account</h2>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/account/orders">Orders</Link></li>
        <li><Link to="/account/wishlist">Wishlist</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </section>
  );
}

