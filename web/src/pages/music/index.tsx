import React from "react";

const TRACKS = [
  { title:"Forest Stream", src:"https://cdn.pixabay.com/download/audio/2021/09/01/audio_8b0a6b.mp3?filename=forest-ambient-103107.mp3" },
  { title:"Ocean Waves", src:"https://cdn.pixabay.com/download/audio/2022/01/18/audio_6b7d23.mp3?filename=waves-beach-ambient-10149.mp3" },
  { title:"Night Crickets", src:"https://cdn.pixabay.com/download/audio/2021/10/17/audio_49e7f1.mp3?filename=crickets-ambient-9091.mp3" },
];
// Royalty-free ambient samples from Pixabay CDN (hot-link safe). If you prefer, swap with local assets later.

export default function Music() {
  return (
    <section>
      <h1>🎵 Music</h1>
      <p>Ambient nature sounds for focus and calm.</p>
      <ul style={{ marginTop: 16 }}>
        {TRACKS.map(t => (
          <li key={t.title} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600 }}>{t.title}</div>
            <audio controls preload="none" style={{ width: "100%" }}>
              <source src={t.src} type="audio/mpeg" />
            </audio>
          </li>
        ))}
      </ul>
    </section>
  );
}

