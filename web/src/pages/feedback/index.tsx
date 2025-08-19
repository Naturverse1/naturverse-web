import React from "react";
import FloatingFeedback from "../../components/FloatingFeedback";
import QAForm from "../../components/QAForm";
import QAList from "../../components/QAList";

export default function Feedback() {
  return (
    <main style={{ maxWidth: 820, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>💬 Feedback</h2>
      <p>Tell us what to build next. Your ideas shape the Naturverse.</p>
      <QAForm />
      <hr style={{ margin: "2rem 0" }} />
      <QAList />
      <FloatingFeedback />
    </main>
  );
}

