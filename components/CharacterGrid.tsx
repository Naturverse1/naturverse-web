"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { KingdomFolder } from "@/lib/kingdoms";

/**
 * Client component fed by a build-time manifest generated from /public/kingdoms/*.
 * Keeps runtime dead-simple and Netlify/Static friendly.
 */
type Props = { kingdomFolder: KingdomFolder };

type Manifest = Record<KingdomFolder, string[]>;

export default function CharacterGrid({ kingdomFolder }: Props) {
  const [files, setFiles] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/kingdom-gallery-manifest.json")
      .then((r) => r.json())
      .then((m: Manifest) => setFiles(m[kingdomFolder] ?? []))
      .catch(() => setFiles([]));
  }, [kingdomFolder]);

  if (!files) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <p>Characters coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {files.map((rel, i) => {
        const src = `/${rel}`;
        const alt = rel.split("/").pop()?.replace(/\.(png|jpg|jpeg|webp)$/i, "") ?? "character";
        return (
          <Link key={src + i} href={src} target="_blank" className="block rounded-xl border border-slate-200 overflow-hidden">
            <div className="relative aspect-square">
              <Image src={src} alt={alt} fill sizes="50vw" className="object-cover" priority={i < 4} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
