import React from "react";

type Card = {
  name: string;
  species: string;
  date: string;
  imageUrl?: string;
  powers: string[];
  backstory: string;
};

/**
 * Temporary stub so Netlify builds are green.
 * Replace with the real share widget when ready.
 */
export default function ShareNavatar(_props: { card: Card }) {
  return null; // or a minimal <div style={{display:'none'}} />
}

