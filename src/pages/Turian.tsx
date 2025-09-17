import { useMemo, useState } from "react";
import TurianChat from "../components/TurianChat";
import { addBadge, addStamp, grantNatur } from "../utils/progress";
import { setTitle } from "./_meta";
import "./turian.css";

type QuestCategory = "Nature" | "Learning" | "Creative" | "Adventure" | "Fun";

type Quest = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: QuestCategory;
  reward: { natur: number; stamp: string };
};

const QUESTS: Quest[] = [
  {
    id: "leafy-art",
    title: "Leafy Art",
    description: "Collect 5 different leaves and create a collage. Snap a photo or describe your masterpiece!",
    icon: "🎨",
    category: "Creative",
    reward: { natur: 5, stamp: "Neighborhood" },
  },
  {
    id: "star-gazing",
    title: "Star Gazing",
    description: "Look at the night sky and spot 5 constellations or bright stars. Sketch or name your favorites!",
    icon: "✨",
    category: "Nature",
    reward: { natur: 5, stamp: "Skywatch" },
  },
  {
    id: "fruit-friend",
    title: "Fruit Friend",
    description: "Draw your favorite fruit, give it a silly name, and invent a short story about its adventures.",
    icon: "🍎",
    category: "Fun",
    reward: { natur: 5, stamp: "Creative" },
  },
  {
    id: "riddle-me",
    title: "Riddle Me",
    description: "Solve Turian's riddle: What has roots as nobody sees, is taller than trees, up, up it goes?",
    icon: "🧠",
    category: "Learning",
    reward: { natur: 5, stamp: "Learning" },
  },
  {
    id: "nature-hike",
    title: "Nature Hike",
    description: "Take a 10-minute walk outside and spot three different plants or trees. Describe what makes them unique.",
    icon: "🥾",
    category: "Adventure",
    reward: { natur: 5, stamp: "Adventure" },
  },
];

function pickRandomQuest(previous?: Quest | null): Quest {
  if (QUESTS.length === 1) return QUESTS[0];
  let next = QUESTS[Math.floor(Math.random() * QUESTS.length)];
  if (!previous) return next;
  for (let attempt = 0; attempt < 4 && next.id === previous.id; attempt += 1) {
    next = QUESTS[Math.floor(Math.random() * QUESTS.length)];
  }
  return next.id === previous.id ? QUESTS.find((quest) => quest.id !== previous.id) ?? next : next;
}

export default function TurianPage() {
  setTitle("Turian");

  return (
    <main className="nv-page">
      <nav className="nv-breadcrumbs">
        <a href="/">Home</a> <span>/</span> <span>Turian</span>
      </nav>

      <section className="nv-hero">
        <h1 className="nv-hero_title">Turian the Durian</h1>
        <p className="nv-hero_sub">
          Ask for tips, quests, and facts. Turian is standing by with cheerful guidance.
        </p>
      </section>

      <TurianQuestBoard />

      <section className="turian-chat_section">
        <h2 className="turian-chat_heading">Chat with Turian</h2>
        {/* badge lives inside the card header; status text is set by the component */}
        <TurianChat />
      </section>
    </main>
  );
}

function TurianQuestBoard() {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [status, setStatus] = useState<"idle" | "accepting" | "accepted" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [error, setError] = useState("");

  const categoryClass = useMemo(() => {
    if (!quest) return "";
    return quest.category.toLowerCase();
  }, [quest]);

  const rollQuest = () => {
    const next = pickRandomQuest(quest);
    setQuest(next);
    setStatus("idle");
    setFeedback("");
    setSyncMessage("");
    setError("");
  };

  const acceptQuest = async () => {
    if (!quest || status === "accepting" || status === "accepted") return;
    setStatus("accepting");
    setError("");

    try {
      const naturResult = await grantNatur(quest.reward.natur, `Quest: ${quest.title}`);
      const stampResult = await addStamp(quest.reward.stamp, quest.title);
      const badgeResult = await addBadge(quest.reward.stamp);

      const details = [
        `+${quest.reward.natur} NATUR`,
        `Stamp: ${quest.reward.stamp}`,
      ];
      if (badgeResult.award) {
        details.push(`${badgeResult.award.emoji} ${badgeResult.award.label}`);
      }
      setFeedback(details.join(" • "));

      const allRemote = [naturResult.status, stampResult.status, badgeResult.status].every(
        (state) => state === "remote" || state === "noop",
      );
      setSyncMessage(
        allRemote
          ? "Synced to NaturBank and Passport."
          : "Saved locally — sign in to sync later.",
      );

      setStatus("accepted");
    } catch (err) {
      console.error(err);
      setFeedback("");
      setSyncMessage("");
      setError("Whoops! Turian couldn't record that quest just now. Try again in a moment.");
      setStatus("error");
    }
  };

  return (
    <section className="turian-quests" aria-labelledby="turian-quests-title">
      <h2 id="turian-quests-title" className="turian-quests__title">
        Quest Board
      </h2>
      <p className="turian-quests__lead">
        Turian rotates five playful missions each day. Spin up a quest, head outside, and earn NATUR with
        passport stamps and badges.
      </p>

      <div className="turian-quests__actions">
        <button
          type="button"
          className="turian-quests__button"
          onClick={rollQuest}
          disabled={status === "accepting"}
        >
          {quest ? "Surprise me again" : "Give me a quest"}
        </button>
      </div>

      {quest ? (
        <article
          key={quest.id}
          className={`turian-quest-card turian-quest-card--${categoryClass} ${
            status === "accepted" ? "turian-quest-card--complete" : ""
          }`}
        >
          <div className="turian-quest-card__icon" aria-hidden="true">
            {quest.icon}
          </div>
          <div className="turian-quest-card__body">
            <div className="turian-quest-card__category">{quest.category}</div>
            <h3 className="turian-quest-card__title">{quest.title}</h3>
            <p className="turian-quest-card__text">{quest.description}</p>

            <div className="turian-quest-card__meta">
              <span className="turian-quest-card__chip" aria-label={`Reward ${quest.reward.natur} NATUR`}>
                <span className="turian-quest-card__chip-icon" aria-hidden="true">
                  🪙
                </span>
                +{quest.reward.natur} NATUR
              </span>
              <span className="turian-quest-card__chip" aria-label={`Passport stamp ${quest.reward.stamp}`}>
                <span className="turian-quest-card__chip-icon" aria-hidden="true">
                  📘
                </span>
                {quest.reward.stamp} stamp
              </span>
            </div>

            <div className="turian-quest-card__actions">
              <button
                type="button"
                className="turian-quest-card__button turian-quest-card__button--primary"
                onClick={acceptQuest}
                disabled={status === "accepting" || status === "accepted"}
              >
                {status === "accepting" ? "Accepting…" : status === "accepted" ? "Accepted" : "Accept quest"}
              </button>
              <button
                type="button"
                className="turian-quest-card__button turian-quest-card__button--ghost"
                onClick={rollQuest}
                disabled={status === "accepting"}
              >
                Another quest
              </button>
            </div>

            {feedback && status === "accepted" && (
              <div className="turian-quest-card__status" role="status" aria-live="polite">
                <div className="turian-quest-card__status-main">✅ {feedback}</div>
                <div className="turian-quest-card__status-sub">{syncMessage}</div>
              </div>
            )}

            {status === "error" && error && (
              <div className="turian-quest-card__status turian-quest-card__status--error" role="status" aria-live="assertive">
                <div className="turian-quest-card__status-main">⚠️ {error}</div>
                <div className="turian-quest-card__status-sub">
                  Your progress is safe — try again when you have a steadier connection.
                </div>
              </div>
            )}
          </div>
        </article>
      ) : (
        <div className="turian-quests__placeholder" role="status" aria-live="polite">
          <p>
            Tap <strong>Give me a quest</strong> to unlock a mini-mission. Turian will keep it gentle and fun for
            explorers of all ages.
          </p>
        </div>
      )}
    </section>
  );
}
