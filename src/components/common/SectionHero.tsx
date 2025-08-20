import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  emoji?: string;
  children?: React.ReactNode;
};

export default function SectionHero({ title, subtitle, emoji, children }: Props) {
  return (
    <section style={{ padding: "32px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>
          {emoji ? <span style={{ marginRight: 12 }}>{emoji}</span> : null}
          {title}
        </h1>
        {subtitle ? (
          <p style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>{subtitle}</p>
        ) : null}
        {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}
      </div>
    </section>
  );
}
