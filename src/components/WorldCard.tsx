import React from "react";
import NVImage from "../utils/NVImage";
import "./worlds.css";

type Props = {
  name: string;
  summary: string;
  slug: string;
  kingdom: string;
  zones: number;
  difficulty: number;
  image?: string;
  onShare?: (url: string) => void;
};

export default function WorldCard({
  name,
  summary,
  slug,
  kingdom,
  zones,
  difficulty,
  image,
  onShare,
}: Props) {
  const url = `/worlds/${slug}`;
  const dots = "●".repeat(difficulty) + "○".repeat(5 - difficulty);

  async function share(e: React.MouseEvent) {
    e.preventDefault();
    const shareUrl = new URL(url, location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: summary, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        onShare?.(shareUrl);
      }
    } catch {}
  }

  return (
    <article className="world-card">
      <a className="world-card__image" href={url} aria-label={`Open ${name}`}>
        {image ? (
          <NVImage
            alt={name}
            src={image}
            className="nv-object-cover"
            sizes="(max-width: 768px) 90vw, 320px"
            width={320}
            height={200}
            placeholder="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200'%3E%3Crect fill='%23eef2ff' width='100%25' height='100%25'/%3E%3C/svg%3E"
          />
        ) : (
          <div className="world-card__ph" />
        )}
      </a>

      <div className="world-card__body">
        <header className="world-card__header">
          <h3 className="world-card__title">
            <a href={url}>{name}</a>
          </h3>
          <button
            className="world-card__share"
            onClick={share}
            aria-label={`Share ${name}`}
          >
            ↗
          </button>
        </header>
        <p className="world-card__meta">
          <span className={`world-card__kingdom k-${kingdom.toLowerCase()}`}>{kingdom}</span>
          <span
            title={`${difficulty}/5 difficulty`}
            aria-label={`${difficulty} out of 5 difficulty`}
          >
            {dots}
          </span>
          <span>{zones} zones</span>
        </p>
        <p className="world-card__summary">{summary}</p>
      </div>
    </article>
  );
}

