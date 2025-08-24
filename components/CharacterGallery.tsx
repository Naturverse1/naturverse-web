// @ts-nocheck
"use client";
import * as React from "react";
import Image from "next/image";

type Props = { folder: string }; // e.g., "Thailandia"
const IMG_RX = /\.(png|jpe?g|webp)$/i;
const EXCLUDE_RX = /(map|manifest\.json|\.keep)$/i;
const BASE = "/kingdoms"; // hard lock to /public/kingdoms

export default function CharacterGallery({ folder }: Props) {
  const [files, setFiles] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BASE}/${folder}/manifest.json`, { cache: "no-store" });
        let list: any[] = [];
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) list = data;
          else if (Array.isArray(data.files)) list = data.files;
          else if (Array.isArray(data.items)) list = data.items;
          else list = Object.values(data ?? {});
        }
        const clean = list
          .map((item: any) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object") {
              if (typeof item.src === "string") return item.src.replace(/^\/?/, "");
              if (typeof item.path === "string") return item.path.replace(/^\/?/, "");
            }
            return String(item);
          })
          .map(String)
          .filter((f) => IMG_RX.test(f) && !EXCLUDE_RX.test(f))
          .map((f) =>
            encodeURI(
              f.startsWith("kingdoms/")
                ? `/${f.replace(/^kingdoms/, "kingdoms")}`
                : `${BASE}/${folder}/${f}`
            )
          );
        if (!cancelled) setFiles(clean);
      } catch {
        if (!cancelled) setFiles([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [folder]);

  if (files === null) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!files.length) return <p>Characters coming soon.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {files.map((src) => {
        const name = decodeURIComponent(src.split("/").pop() || "").replace(/\.(png|jpe?g|webp)$/i, "");
        return (
          <a key={src} href={src} className="block overflow-hidden rounded-xl border" target="_blank">
            <div className="relative aspect-square">
              <Image src={src} alt={name} fill sizes="(max-width:768px) 50vw, 300px" className="object-cover" />
            </div>
            <div className="px-3 py-2 text-sm">{name}</div>
          </a>
        );
      })}
    </div>
  );
}

