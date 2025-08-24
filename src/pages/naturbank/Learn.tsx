import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function Learn() {
  return (
    <main id="main" className="page-wrap">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/naturbank", label: "NaturBank" }, { label: "Learn" }]} />
      <h1>📘 Learn</h1>
      <ul className="bullet">
        <li><b>Safety:</b> keep keys private, avoid DM links, verify sites.</li>
        <li><b>Wallets:</b> start with custodial; graduate to self-custody when ready.</li>
        <li><b>NATUR:</b> earn via quests; spend on merch, cards, and passes.</li>
      </ul>
      <p className="meta">AI tutor lessons and quizzes plug in here later.</p>
    </main>
  );
}
