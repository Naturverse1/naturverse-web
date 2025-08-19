import React from "react";
import CategoryChips from "./CategoryChips";
import PriceRange from "./PriceRange";
import SortSelect from "./SortSelect";

export default function Filters() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <CategoryChips />
      <PriceRange />
      <SortSelect />
    </div>
  );
}

