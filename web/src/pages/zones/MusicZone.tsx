import { Link } from "react-router-dom";

export default function MusicZone() {
  return (
    <section>
      <h2>🎵 Music Zone</h2>
      <p>Discover eco-inspired beats, ambient nature, and learning playlists.</p>

      <h3>Playlists</h3>
      <ul>
        <li>Focus Forest (lo-fi, rain)</li>
        <li>Ocean Calm (waves, whales)</li>
        <li>Desert Night (wind, synth)</li>
      </ul>

      <h3>Activities</h3>
      <ul>
        <li>Make a beat in <Link to="/zones/creator-lab">Creator Lab</Link></li>
        <li>Share a track in <Link to="/zones/community">Community</Link></li>
      </ul>

      <p>Want a soundtrack while you explore? Keep this tab open and roam the Naturverse.</p>
    </section>
  );
}

