import React from 'react';

export default function SearchBox({ onFocus }: { onFocus?: () => void }) {
  return (
    <input
      className="nv-search"
      placeholder="Search worlds, zones, marketplace, quests"
      aria-label="Open command palette"
      onFocus={onFocus}
      onKeyDown={(e) => { if (e.key === 'Enter') onFocus?.(); }}
      readOnly
    />
  );
}
