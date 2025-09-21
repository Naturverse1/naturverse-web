import React from "react";

type AssistantFabProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

/**
 * Small, self-contained FAB whose wrapper cannot steal clicks.
 * The wrapper has pointer-events: none; only the button is interactive.
 */
export default function AssistantFab({ onClick, ariaLabel = "Ask Turian" }: AssistantFabProps) {
  return (
    <div className="fab-root" aria-hidden={false}>
      <button
        type="button"
        className="fab-button"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <img
          src="/favicon-64x64.png"
          alt=""
          width={32}
          height={32}
          style={{ display: "block" }}
        />
      </button>
    </div>
  );
}
