import React from "react";
import { useParams } from "react-router-dom";

export default function NaturbankSection(){
  const { section } = useParams();
  if(section==="wallet"){
    return (
      <section>
        <h1 className="h1">🪙 Wallet</h1>
        <p className="p">Demo address (placeholder): <code>0xNATUR...abcd</code></p>
        <button className="btn">Create Wallet (stub)</button>
      </section>
    );
  }
  if(section==="token"){
    return (
      <section>
        <h1 className="h1">🪙 NATUR Token</h1>
        <p className="p">Balance: <b>120 NATUR</b> (demo)</p>
        <ul className="list">
          <li>+20 — Thailandia quest</li>
          <li>+50 — Quiz tournament</li>
          <li>-10 — Sticker pack</li>
        </ul>
      </section>
    );
  }
  if(section==="nfts"){
    return (
      <section>
        <h1 className="h1">🪙 NFTs</h1>
        <p className="p">Mint your Navatar card (stub UI).</p>
        <button className="btn">Mint Demo NFT</button>
      </section>
    );
  }
  return (
    <section>
      <h1 className="h1">🪙 Learn</h1>
      <ul className="list">
        <li>What is a wallet?</li>
        <li>Custodial vs non-custodial</li>
        <li>Safety: seeds & phishing</li>
      </ul>
    </section>
  );
}
