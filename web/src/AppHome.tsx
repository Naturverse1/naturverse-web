import React from "react";
import { Link } from "react-router-dom";

export default function AppHome() {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section style={{ margin: "1.25rem 0" }}>
      <h3>{title}</h3>
      <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: "1rem" }}>{children}</ul>
    </section>
  );

  const Item = ({ to, label }: { to: string; label: string }) => (
    <li><Link to={to}>{label}</Link></li>
  );

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>The Naturverse</h1>
      <p>Welcome 🌿 Naturverse is live and the client router is working.</p>

      <Section title="Explore">
        <Item to="/zones" label="Zones" />
        <Item to="/marketplace" label="Marketplace" />
        <Item to="/arcade" label="Arcade" />
        <Item to="/worlds" label="Worlds" />
      </Section>

      <Section title="Zones (shortcuts)">
        <Item to="/zones/music" label="Music" />
        <Item to="/zones/wellness" label="Wellness" />
        <Item to="/zones/creator-lab" label="Creator Lab" />
        <Item to="/zones/community" label="Community" />
        <Item to="/zones/teachers" label="Teachers" />
        <Item to="/zones/partners" label="Partners" />
        <Item to="/zones/naturversity" label="Naturversity" />
        <Item to="/zones/parents" label="Parents" />
      </Section>

      <Section title="Content">
        <Item to="/stories" label="Stories" />
        <Item to="/quizzes" label="Quizzes" />
        <Item to="/observations" label="Observations" />
        <Item to="/tips" label="Turian Tips" />
      </Section>

      <Section title="Account">
        <Item to="/account" label="Account Home" />
        <Item to="/account/orders" label="Orders" />
        <Item to="/account/wishlist" label="Wishlist" />
        <Item to="/feedback" label="Feedback" />
      </Section>
    </main>
  );
}

