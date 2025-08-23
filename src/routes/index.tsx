import HubCard from '../components/HubCard';
import HubGrid from '../components/HubGrid';
import "./Home.css";
import ImageSmart from '../components/ImageSmart';

export default function Home() {
  return (
    <main className="container">
      {/* Clean hero (no oversized emoji) */}
      <header className="home-hero">
        <h1>
          <ImageSmart
            className="brandmark"
            src="/favicon-32x32.png"
            srcSet="/favicon-32x32.png 1x, /favicon-64x64.png 2x"
            width={32}
            height={32}
            alt=""
            aria-hidden="true"
            priority
          />
          Welcome to the Naturverse™
        </h1>
        <p>Pick a hub to begin your adventure.</p>
      </header>

      <HubGrid>
        <HubCard to="/worlds" emoji="📚" title="Worlds" sub="Travel the 14 magical kingdoms." />
        <HubCard
          to="/zones"
          emoji="🎮🎵🧘"
          title="Zones"
          sub="Arcade, Music, Wellness, Creator Lab, Stories, Quizzes."
        />
        <HubCard
          to="/marketplace"
          emoji="🛍️"
          title="Marketplace"
          sub="Wishlists, catalog, checkout."
        />
        <HubCard
          to="/naturversity"
          emoji="🎓"
          title="Naturversity"
          sub="Teachers, partners, and courses."
        />
        <HubCard
          to="/naturbank"
          emoji="🪙"
          title="Naturbank"
          sub="Wallets, NATUR token, and crypto basics."
        />
        <HubCard to="/navatar" emoji="❎" title="Navatar" sub="Create your character." />
        <HubCard
          to="/passport"
          emoji="🪪"
          title="Passport"
          sub="Track stamps, badges, XP & coins."
        />
        <HubCard to="/turian" emoji="🟢" title="Turian" sub="AI guide for tips & quests." />
        <HubCard to="/profile" emoji="👤" title="Profile" sub="Your account & saved navatar." />
      </HubGrid>
    </main>
  );
}
