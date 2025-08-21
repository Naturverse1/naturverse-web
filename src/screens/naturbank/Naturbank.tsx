import React from "react";
import { Link } from "react-router-dom";

export default function Naturbank(){
  const cards = [
    ["wallet","Wallet","Create custodial wallet & view address."],
    ["token","NATUR Token","Earnings, redemptions, and ledger."],
    ["nfts","NFTs","Mint navatar cards & collectibles."],
    ["learn","Learn","Crypto basics & safety guides."]
  ] as const;

  return (
    <section>
      <h1 className="h1">Naturbank</h1>
      <div className="grid">
        {cards.map(([slug,title,blurb])=>(
          <Link to={`/naturbank/${slug}`} key={slug} className="card">
            <h3>🪙 {title}</h3><div className="small">{blurb}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
