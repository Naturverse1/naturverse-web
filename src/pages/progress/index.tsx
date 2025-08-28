import React from "react";
import NavatarStepper from "../../components/NavatarStepper";

export default function ProgressPage() {
  // Simulate logged-in user
  const userId = "demo-user-123";

  return (
    <main style={{ maxWidth: 800, margin: "24px auto", padding: "0 20px" }}>
      <h1>Navatar Progress</h1>
      <p style={{ opacity: .8 }}>Track your journey through quizzes, stamps, and zones.</p>
      <NavatarStepper userId={userId} />
    </main>
  );
}
