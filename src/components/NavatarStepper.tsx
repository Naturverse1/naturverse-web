import React from "react";
import "./stepper.css";

// Types
type Step = {
  key: string;
  label: string;
};

type Props = {
  userId?: string;
  steps?: Step[];
  current?: string; // override if provided
};

// Default step sequence
const DEFAULT_STEPS: Step[] = [
  { key: "intro", label: "Intro" },
  { key: "quiz", label: "First Quiz" },
  { key: "stamp", label: "Earn Stamp" },
  { key: "zone", label: "Unlock Zone" },
  { key: "done", label: "Completion" }
];

export default function NavatarStepper({ userId, steps = DEFAULT_STEPS, current }: Props) {
  const [active, setActive] = React.useState<string>(current || "intro");

  // In real app: fetch from Supabase
  React.useEffect(() => {
    if (!userId || current) return;
    // Fallback logic: simulate user progress
    // Replace with Supabase fetch when hooked up
    const saved = localStorage.getItem("nv_progress_" + userId);
    if (saved) setActive(saved);
  }, [userId, current]);

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
