import React from "react";
import Page from "../components/Page";
import Meta from "../components/Meta";
import { Img } from "../components";
import { setTitle } from "./_meta";

// Use site favicon as Turian's mascot for consistent branding
const mascotSrc = "/favicon.ico";

export default function TurianPage() {
  setTitle("Turian");
  return (
    <div id="turian-page" className="nvrs-section turian nv-secondary-scope">
      <Page
        title="Turian the Durian"
        subtitle="Ask for tips, quests, and facts. This is an offline demo—no external calls or models yet."
        dataPage="turian"
      >
        <Meta title="Turian — Naturverse" description="Offline AI assistant demo." />
        <section className="turian-chat">
          <div className="chatCard">
            <div className="nv-card" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              {mascotSrc ? (
                <Img src={mascotSrc} alt="Turian favicon" width={32} height={32} style={{ borderRadius: 8 }} />
              ) : (
                <span role="img" aria-label="durian" style={{ fontSize: 32 }}>🥭</span>
              )}
              <div>
                <strong>Chat with Turian</strong>
                <div className="nv-muted">Chat feature temporarily disabled.</div>
              </div>
            </div>
            <p className="fineprint">Live chat coming soon.</p>
          </div>
        </section>
      </Page>
    </div>
  );
}

