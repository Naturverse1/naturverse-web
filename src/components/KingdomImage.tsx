import React, { useMemo, useState } from "react";
import Img from "./Img";

type Kind = "card" | "hero" | "logo";

/** Try common filenames inside /kingdoms/<Name>/ and render the first that loads. */
export default function KingdomImage({
  kingdom,         // e.g. "Thailandia"
  kind = "card",   // "card" | "hero" | "logo"
  className = "",
  alt = "",
  style,
}: {
  kingdom: string;
  kind?: Kind;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}) {
  const [idx, setIdx] = useState(0);

  const candidates = useMemo(() => {
    const base = `/kingdoms/${kingdom}`;
    const namesByKind: Record<Kind, string[]> = {
      card: ["card", "thumb", "cover", "hero", "logo"],
      hero: ["hero", "cover", "banner", "card"],
      logo: ["logo", "mark", "icon", "card"],
    };
    const exts = ["webp", "jpg", "jpeg", "png"];
    const names = namesByKind[kind];
    return names.flatMap(n => exts.map(ext => `${base}/${n}.${ext}`));
  }, [kingdom, kind]);

  if (!candidates.length) return null;

  const onErr = () => {
    if (idx < candidates.length - 1) setIdx(i => i + 1);
  };

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Img
      src={candidates[idx]}
      onError={onErr}
      className={className}
      alt={alt || `${kingdom}`}
      style={style}
    />
  );
}
