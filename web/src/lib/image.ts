export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
      (img as any)._url = url;
      (window as any)._lastImg = img;
    });
    return (window as any)._lastImg as HTMLImageElement;
  } finally {
    // URL revoked after canvas export
  }
}

export function drawToCanvas(img: HTMLImageElement, max = 512) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  // keep aspect, fit within max x max
  const r = Math.min(max / img.width, max / img.height, 1);
  const w = Math.max(1, Math.round(img.width * r));
  const h = Math.max(1, Math.round(img.height * r));
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

export async function canvasToWebPDataURL(canvas: HTMLCanvasElement, quality = 0.9) {
  return new Promise<string>((resolve) =>
    canvas.toBlob(
      (b) => resolve(URL.createObjectURL(b!)),
      'image/webp',
      quality
    )
  );
}

export function canvasToDataURL(canvas: HTMLCanvasElement, quality = 0.9) {
  return canvas.toDataURL('image/webp', quality);
}
