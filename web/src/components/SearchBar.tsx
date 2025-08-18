import React from 'react';

export default function SearchBar() {
  const open = () => {
    try {
      window.dispatchEvent(new CustomEvent('nv_palette_open'));
    } catch {}
  };
  return (
    <button className="menu-btn" onClick={open}>
      Search (⌘K)
    </button>
  );
}

