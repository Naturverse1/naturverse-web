import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  to: string;
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function ClickableCard({
  to,
  enabled,
  className = "",
  children,
  ariaLabel,
}: Props) {
  const navigate = useNavigate();

  if (!enabled) {
    return (
      <div
        className={className}
        style={{ pointerEvents: "none", userSelect: "none" }}
        aria-disabled="true"
        tabIndex={-1}
      >
        {children}
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      className={className}
      aria-label={ariaLabel}
      onClick={() => navigate(to)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

