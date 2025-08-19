import React, { useEffect, useState } from "react";

export default function NatureClicker() {
  const [sprouts, setSprouts] = useState(0);
  const [trees, setTrees] = useState(0);
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (auto > 0) setSprouts(s => s + auto);
    }, 1000);
    return () => window.clearInterval(id);
  }, [auto]);

  function plant() { setSprouts(s => s + 1); }
  function growTree() {
    if (sprouts < 10) return;
    setSprouts(s => s - 10);
    setTrees(t => t + 1);
  }
  function hireGardener() {
    if (trees < 3) return;
    setTrees(t => t - 3);
    setAuto(a => a + 1);
  }

  return (
    <section>
      <h1>🌿 Nature Clicker</h1>
      <p>Tap to plant sprouts → convert to trees → hire gardeners to auto-plant.</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
        <div style={{ border:"1px solid #eee", borderRadius:8, padding:12 }}>
          <div style={{ fontWeight:600 }}>Sprouts: {sprouts}</div>
          <button onClick={plant} style={{ marginTop:8, width:"100%" }}>Plant +1</button>
          <button onClick={growTree} style={{ marginTop:8, width:"100%" }} disabled={sprouts<10}>
            Grow Tree (cost 10)
          </button>
        </div>
        <div style={{ border:"1px solid #eee", borderRadius:8, padding:12 }}>
          <div style={{ fontWeight:600 }}>Trees: {trees}</div>
          <div>Gardeners: {auto}/s</div>
          <button onClick={hireGardener} style={{ marginTop:8, width:"100%" }} disabled={trees<3}>
            Hire Gardener (cost 3 trees)
          </button>
        </div>
      </div>
    </section>
  );
}

