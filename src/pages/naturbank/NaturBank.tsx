import React from "react";
import PromptForm from "../../components/PromptForm";
import { aiComplete } from "../../lib/openai";

export default function NaturBank() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">NaturBank</h1>
      <p className="text-neutral-700">Web3 basics, custodial tips, NFTs (coming soon), and $NATUR learn &amp; earn.</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Web3 & Crypto Basics (AI Guide)</h2>
        <PromptForm
          label="Ask anything about wallets, blockchains, & $NATUR:"
          placeholder="Explain what a wallet is for a 10 year old…"
          button="Explain"
          onRun={(p)=>aiComplete({ prompt: `Explain clearly and kid-safe: ${p}` }).then(r=>r.text)}
        />
      </section>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">NFTs</h2>
        <p className="text-sm text-neutral-600">Mint & marketplace wiring planned. Placeholder UI only.</p>
        <div className="border rounded p-3">Connect wallet & mint NFT from Navatar (coming soon).</div>
      </section>
    </div>
  );
}
