import { useEffect, useState } from "react";

export default function Health() {
  const [status, setStatus] = useState<string>("checking…");

  useEffect(() => {
    fetch("/.netlify/functions/health")
      .then((r) => r.json())
      .then((d) => setStatus(d.ok ? "ok ✅" : "not ok"))
      .catch(() => setStatus("not ok"));
  }, []);

  return (
    <main className="page">
      <h1>Health</h1>
      <p>API status: {status}</p>
    </main>
  );
}
