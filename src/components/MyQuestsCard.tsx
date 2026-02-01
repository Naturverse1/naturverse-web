import { useQuestState } from "@/features/quests/useQuestState";
import "./my-quests.css";

export default function MyQuestsCard() {
  const {
    active,
    streak,
    completedToday,
    feedback,
    syncMessage,
    error,
    marking,
    markComplete,
  } = useQuestState();

  return (
    <section className="my-quests" aria-labelledby="my-quests-title">
      <h3 id="my-quests-title" className="my-quests__title">
        My Quests
      </h3>

      {!active && (
        <div className="my-quests__empty" role="status">
          No active quest yet. Tap <strong>Give me a quest</strong> above to get started.
        </div>
      )}

      {active && (
        <div className={`my-quests__card ${completedToday ? "my-quests__card--done" : ""}`}>
          <div className="my-quests__header">
            <div className="my-quests__info">
              <div className="my-quests__label">Active quest</div>
              <div className="my-quests__name">{active.title}</div>
              <div className="my-quests__meta">
                Reward: +{active.rewardNatur} NATUR • Stamp: {active.stamp}
              </div>
            </div>
            <div className="my-quests__streak" aria-label={`Daily streak ${streak} day${streak === 1 ? "" : "s"}`}>
              <span aria-hidden="true">🔥</span>
              <span>{streak}</span>
              <span className="my-quests__streak-label">day{streak === 1 ? "" : "s"}</span>
            </div>
          </div>

          <div className="my-quests__actions">
            {completedToday ? (
              <button className="my-quests__button my-quests__button--done" type="button" disabled>
                Completed today ✓
              </button>
            ) : (
              <button
                className="my-quests__button my-quests__button--primary"
                type="button"
                onClick={markComplete}
                disabled={marking}
              >
                {marking ? "Marking…" : "Mark complete"}
              </button>
            )}
          </div>

          {feedback && (
            <div className="my-quests__status" role="status" aria-live="polite">
              <div className="my-quests__status-main">✅ {feedback}</div>
              {syncMessage && <div className="my-quests__status-sub">{syncMessage}</div>}
            </div>
          )}

          {error && (
            <div className="my-quests__status my-quests__status--error" role="alert">
              <div className="my-quests__status-main">⚠️ {error}</div>
              <div className="my-quests__status-sub">
                Your progress is safe — try again when you have a steadier connection.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
