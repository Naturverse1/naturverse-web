import React, { useRef } from "react";
import type { Navatar } from "../lib/navatar/types";

type Props = { n: Navatar };

export default function NavatarCard({ n }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const download = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const W = 720, H = 420;
    c.width = W; c.height = H;

    // BG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = n.color;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0,0,W,H);
    ctx.globalAlpha = 1;

    // Photo or emoji circle
    const cx = 120, cy = 210, r = 90;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.closePath();
    ctx.fillStyle = "#f8fafc"; ctx.fill();

    if (n.photo) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r-2, 0, Math.PI*2); ctx.closePath(); ctx.clip();
        const s = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, cx-r, cy-r, r*2, r*2);
        ctx.restore();
        drawText();
        finish();
      };
      img.src = n.photo;
      return;
    } else {
      ctx.font = "72px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji";
      ctx.textAlign = "center"; ctx.fillText(n.emoji, cx, cy+26);
    }

    drawText();
    finish();

    function drawText() {
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 32px ui-sans-serif, system-ui"; ctx.textAlign = "left";
      ctx.fillText(n.name, 240, 120);
      ctx.font = "600 18px ui-sans-serif, system-ui"; ctx.fillStyle = "#334155";
      ctx.fillText(`${n.base} · ${n.species}`, 240, 150);

      ctx.fillStyle = "#0f172a"; ctx.font = "700 20px ui-sans-serif";
      ctx.fillText("Power", 240, 190);
      ctx.font = "18px ui-sans-serif"; ctx.fillStyle = "#1f2937";
      ctx.fillText(n.power, 240, 218);

      wrapText(ctx, n.backstory, 240, 260, 440, 22);
    }

    function finish() {
      const a = document.createElement("a");
      a.download = `${n.name.replace(/\s+/g,"_")}_card.png`;
      a.href = c.toDataURL("image/png");
      a.click();
    }
  };

  return (
    <div className="navatar-card">
      <div className="navatar-card__left" style={{ borderColor: n.color }}>
        {n.photo ? <img src={n.photo} alt="" /> : <div className="big-emoji" style={{ color: n.color }}>{n.emoji}</div>}
      </div>
      <div className="navatar-card__right">
        <div className="title">{n.name}</div>
        <div className="muted">{n.base} · {n.species}</div>
        <div className="chip" style={{ background: n.color + "22", borderColor: n.color }}>{n.power}</div>
        <p className="story">{n.backstory}</p>
        <button className="btn tiny" onClick={download}>Download PNG</button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
