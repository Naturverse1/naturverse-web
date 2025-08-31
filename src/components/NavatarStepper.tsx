import React from "react";
import { useSupabase } from "../lib/useSupabase";
import "./stepper.css";

// Types
type Step = {
  key: string;
  label: string;
};

type Props = {
  userId?: string;
  steps?: Step[];
};

// Default step sequence
const DEFAULT_STEPS: Step[] = [
  { key: "intro", label: "Intro" },
  { key: "quiz", label: "First Quiz" },
  { key: "stamp", label: "Earn Stamp" },
  { key: "zone", label: "Unlock Zone" },
  { key: "done", label: "Completion" }
];

export default function NavatarStepper({ userId, steps = DEFAULT_STEPS }: Props) {
  const supabase = useSupabase();
  const [active, setActive] = React.useState<string>("intro");
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        if (!supabase) throw new Error('no-supabase');
        // 1. Check quiz attempts
        const { data: quiz } = await supabase
          .from("user_quiz_attempts")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (!quiz) {
          setActive("quiz");
          return;
        }

        // 2. Check stamps
        const { data: stamp } = await supabase
          .from("stamps")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();

        if (!stamp) {
          setActive("stamp");
          return;
        }

        // 3. If both exist, consider zone unlocked
        setActive("zone");

        // 4. Optional: mark done if additional flag (expand later)
      } catch (err) {
        console.error("Stepper fetch error", err);
        // fallback to local
        const saved = localStorage.getItem("nv_progress_" + userId);
        if (saved) setActive(saved);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, supabase]);

  if (loading) return <div>Loading progress…</div>;

  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const isActive = s.key === active;
        const isDone = steps.findIndex(st => st.key === active) > i;
        return (
          <div key={s.key} className={`step ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}>
            <div className="step__dot">{isDone ? "✓" : i + 1}</div>
            <div className="step__label">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
