import { useEffect, useState } from "react";
import { fetchProgress } from "@/lib/progress";
import { BADGES } from "@/data/badges";
import { track } from "@/lib/analytics";

export default function ProfileMini() {
  const [streak, setStreak] = useState<{ current_streak: number; longest_streak: number } | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProgress();
        setStreak(data.streak);
        setBadges((data.badges || []).map((b) => b.badge_code));
        track("profile_progress_loaded");
      } catch (e: any) {
        setErr("");
      }
    })();
  }, []);

  return (
    <div className="profile-mini" title="Your progress">
      <div className="streak">
        🔥 {streak?.current_streak ?? 0}
      </div>
      <div className="badges">
        {badges.slice(0, 3).map((code) => (
          <span key={code} className="badge">
            {(BADGES as any)[code]?.label || code}
          </span>
        ))}
      </div>
      <style>{`
        .profile-mini{display:flex;align-items:center;gap:8px;border:1px solid #e5e7eb;padding:6px 10px;border-radius:999px;background:#fff}
        .streak{font-weight:600}
        .badges{display:flex;gap:6px}
        .badge{font-size:12px;padding:2px 8px;border-radius:999px;background:#eef2ff;border:1px solid #c7d2fe}
      `}</style>
    </div>
  );
}
