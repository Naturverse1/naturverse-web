import React from "react";

export default function Chinadia() {
  return (
    <main>
      <nav className="breadcrumbs">
        <a href="/">Home</a> / <a href="/naturversity">Naturversity</a> / <a href="/naturversity/languages">Languages</a> / Chinadia (Mandarin)
      </nav>

      <h1>Chinadia (Mandarin) — 中文</h1>
      <p>Learn greetings, alphabet basics, and common phrases for Chinadia.</p>

      <section className="lang-page">
        <div>
          <img
            className="lang-hero"
            src="/Languages/Cranelanguagemainchina.png"
            alt="Mandarin welcome illustration"
          />
          <img
            className="lang-secondary"
            src="/Languages/Turianlanguagechina.png"
            alt="Turian language friend"
            loading="lazy"
          />
        </div>

        <div className="lang-content">
          <h3>Starter phrases</h3>
          <ul>
            <li><strong>Hello:</strong> สวัสดี — <em>sà-wàt-dee</em></li>
            <li><strong>Thank you:</strong> ขอบคุณ — <em>khàwp-khun</em></li>
          </ul>

          <h3>Alphabet basics</h3>
          <ul>
            <li>ก (gor) • ข (khor) • ค (khor) • ง (ngor) • จ (jor)</li>
          </ul>

          <h3>Numbers 1–10</h3>
          <ul>
            <li>๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙ ๑๐ — <em>nùeng, sŏng, sǎam, sìi, hâa, hòk, jèt, bpàet, gâo, sǐp</em></li>
          </ul>
        </div>
      </section>
    </main>
  );
}

