import { useEffect, useMemo, useState } from 'react';
import { getMyAvatar, navatarImageUrl } from '@/lib/navatar';
import { useToast } from '@/components/Toast';
import '@/styles/share-navatar.css';

const CANVAS_SIZE = 1080;

type TemplateId = 'tee' | 'plush' | 'stickers';

type Template = {
  id: TemplateId;
  label: string;
  headline: string;
  accent: string;
};

const TEMPLATES: Template[] = [
  { id: 'tee', label: 'Tee', headline: 'Naturverse Kickstarter Tee', accent: '#2563eb' },
  { id: 'plush', label: 'Plush', headline: 'Limited Plush Friend', accent: '#ec4899' },
  { id: 'stickers', label: 'Sticker Board', headline: 'Sticker Sheet Preview', accent: '#f59e0b' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

type NavatarInfo = { imageUrl: string | null; name: string } | null;

type RenderOptions = {
  template: Template;
  navatarUrl?: string | null;
  navatarName?: string;
};

function drawRoundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, template: Template) {
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.fillStyle = template.accent + '22';
  ctx.beginPath();
  ctx.arc(220, 220, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(880, 260, 180, 0, Math.PI * 2);
  ctx.fill();
}

function drawHeadline(ctx: CanvasRenderingContext2D, template: Template) {
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 64px "Nunito", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Naturverse Marketplace', CANVAS_SIZE / 2, 140);

  ctx.font = '600 46px "Nunito", "Segoe UI", sans-serif';
  ctx.fillStyle = template.accent;
  ctx.fillText(template.headline, CANVAS_SIZE / 2, 220);
}

function drawProductFrame(ctx: CanvasRenderingContext2D, template: Template) {
  ctx.save();
  ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);

  if (template.id === 'tee') {
    ctx.fillStyle = '#ffffff';
    drawRoundRectPath(ctx, -300, -260, 600, 520, 80);
    ctx.fill();

    ctx.fillStyle = template.accent + '33';
    drawRoundRectPath(ctx, -160, -40, 320, 320, 36);
    ctx.fill();
  } else if (template.id === 'plush') {
    const gradient = ctx.createRadialGradient(0, 0, 80, 0, 0, 320);
    gradient.addColorStop(0, '#fbcfe8');
    gradient.addColorStop(1, '#f472b6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-160, -220, 120, 0, Math.PI * 2);
    ctx.arc(160, -220, 120, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#fff7ed';
    drawRoundRectPath(ctx, -340, -260, 680, 520, 46);
    ctx.fill();

    ctx.fillStyle = '#fed7aa';
    drawRoundRectPath(ctx, -300, -200, 220, 160, 28);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.globalAlpha = 0.6;
    drawRoundRectPath(ctx, -80, -220, 240, 180, 28);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fb923c';
    drawRoundRectPath(ctx, 120, -160, 220, 180, 28);
    ctx.fill();
  }

  ctx.restore();
}

async function renderShareImage({ template, navatarUrl, navatarName }: RenderOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  drawBackground(ctx, template);
  drawHeadline(ctx, template);
  drawProductFrame(ctx, template);

  if (navatarUrl) {
    const avatar = await loadImage(navatarUrl);
    const size = template.id === 'stickers' ? 420 : 360;
    const x = (CANVAS_SIZE - size) / 2;
    const y = template.id === 'stickers' ? CANVAS_SIZE / 2 - size / 2 - 20 : CANVAS_SIZE / 2 - size / 2 + 40;
    ctx.save();
    drawRoundRectPath(ctx, x, y, size, size, template.id === 'plush' ? 180 : 48);
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore();
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 42px "Nunito", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Create your Navatar to unlock share art', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = '600 40px "Nunito", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(navatarName ?? 'My Navatar', CANVAS_SIZE / 2, CANVAS_SIZE - 160);

  ctx.font = '32px "Nunito", "Segoe UI", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Kickstarter-ready • naturverse.com/marketplace', CANVAS_SIZE / 2, CANVAS_SIZE - 100);

  return canvas.toDataURL('image/png');
}

export default function ShareNavatar({ open, onClose }: Props) {
  const [navatar, setNavatar] = useState<NavatarInfo>(null);
  const [template, setTemplate] = useState<TemplateId>('tee');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open) {
      setPreview(null);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const avatar = await getMyAvatar();
        const imageUrl = navatarImageUrl(avatar?.image_path ?? null);
        setNavatar(imageUrl ? { imageUrl, name: avatar?.name ?? 'My Navatar' } : null);
      } catch (error) {
        console.warn(error);
        setNavatar(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setPreview(null);
    if (!navatar?.imageUrl) return;
    const activeTemplate = TEMPLATES.find((t) => t.id === template)!;
    setGenerating(true);
    (async () => {
      try {
        const dataUrl = await renderShareImage({ template: activeTemplate, navatarUrl: navatar.imageUrl, navatarName: navatar.name });
        setPreview(dataUrl);
      } catch (error) {
        console.warn(error);
        toast({ text: 'Could not build share image right now.', kind: 'err' });
      } finally {
        setGenerating(false);
      }
    })();
  }, [open, template, navatar?.imageUrl, navatar?.name, toast]);

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return 'https://naturverse.com/marketplace';
    return `${window.location.origin}/marketplace`;
  }, []);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({ text: 'Link copied ✨', kind: 'ok' });
    } catch {
      toast({ text: 'Unable to copy link', kind: 'err' });
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.download = `naturverse-share-${template}.png`;
    a.click();
  };

  const instagramUrl = 'https://www.instagram.com/';
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Kickstarter-ready Navatar merch!')}&url=${encodeURIComponent(shareLink)}`;

  return (
    <div className="nv-share-backdrop" role="dialog" aria-modal="true">
      <div className="nv-share-card">
        <button className="nv-share-close" onClick={onClose} aria-label="Close share modal">
          ×
        </button>
        <h2>Share your Navatar merch</h2>
        <p style={{ marginTop: -8, opacity: 0.8 }}>Show friends what’s coming with our Kickstarter-ready mockups.</p>

        <div className="nv-share-tabs" role="tablist">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              role="tab"
              className={`nv-share-tab${template === tpl.id ? ' nv-share-tab--active' : ''}`}
              onClick={() => setTemplate(tpl.id)}
              aria-selected={template === tpl.id}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <div className="nv-share-preview" aria-live="polite">
          {loading || generating ? (
            <div className="nv-share-loading">Generating preview…</div>
          ) : preview ? (
            <img src={preview} alt="Share preview" />
          ) : (
            <div className="nv-share-empty">
              <p>Create or save a Navatar to see it on merch!</p>
            </div>
          )}
        </div>

        <div className="nv-share-actions">
          <button className="pill" onClick={handleCopy}>
            Copy link
          </button>
          <button className="pill" onClick={handleDownload} disabled={!preview}>
            Download share image
          </button>
          <a className="pill" href={xUrl} target="_blank" rel="noreferrer">
            Post to X
          </a>
          <a className="pill" href={instagramUrl} target="_blank" rel="noreferrer">
            Post to Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
