import React, { useMemo } from "react";

const TIPS = [
  "Take a 3-minute sky break: look up, breathe in for 4, out for 6.",
  "Swap one plastic bottle this week for a reusable one.",
  "Add a leafy plant to your desk; water it every other day.",
  "Walk 10 minutes near trees; notice 3 sounds you hadn’t before.",
  "Pick one fruit or veg you haven’t tried this month—taste adventure!",
  "Turn shower heat down a notch—good for skin and the planet.",
  "Leave a window open for 5 minutes in the morning: fresh air reset.",
];

export default function TurianTips() {
  const tip = useMemo(() => TIPS[Math.floor(Math.random()*TIPS.length)], []);
  return (
    <div style={{ padding:16, border:"1px solid #eee", borderRadius:8 }}>
      <h2 style={{ marginTop:0 }}>🌱 Turian Tips</h2>
      <p style={{ marginBottom:8 }}>{tip}</p>
      <small style={{ opacity:.7 }}>
        New tips rotate on refresh. We’ll plug in the full tips service later.
      </small>
    </div>
  );
}

