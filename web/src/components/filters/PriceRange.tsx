import React, { useEffect, useState } from 'react';

type Props = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

export default function PriceRange({ min, max, onChange }: Props) {
  const [minVal, setMinVal] = useState<string>(String(min || ''));
  const [maxVal, setMaxVal] = useState<string>(max === Infinity ? '' : String(max));

  useEffect(() => { setMinVal(String(min || '')); }, [min]);
  useEffect(() => { setMaxVal(max === Infinity ? '' : String(max)); }, [max]);

  useEffect(() => {
    const t = setTimeout(() => {
      let m1 = parseFloat(minVal);
      let m2 = parseFloat(maxVal);
      if (isNaN(m1) || m1 < 0) m1 = 0;
      if (isNaN(m2) || m2 < 0) m2 = Infinity;
      onChange(m1, m2);
    }, 300);
    return () => clearTimeout(t);
  }, [minVal, maxVal, onChange]);

  return (
    <div className="price-range">
      <input
        type="number"
        placeholder="Min"
        value={minVal}
        onChange={e => setMinVal(e.target.value)}
        min="0"
      />
      <span>–</span>
      <input
        type="number"
        placeholder="Max"
        value={maxVal}
        onChange={e => setMaxVal(e.target.value)}
        min="0"
      />
    </div>
  );
}
