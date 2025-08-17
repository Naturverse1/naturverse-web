export type ComposeBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export async function composePreview({
  baseUrl,
  avatarUrl,
  box,
}: {
  baseUrl: string;
  avatarUrl: string;
  box: ComposeBox;
}): Promise<string> {
  try {
    const baseImg = await loadImage(baseUrl);
    const blob = await fetch(avatarUrl, { mode: 'cors' }).then((r) => r.blob());
    const localUrl = URL.createObjectURL(blob);
    const avatarImg = await loadImage(localUrl);

    const canvas = document.createElement('canvas');
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(baseImg, 0, 0);
    ctx.drawImage(
      avatarImg,
      box.left * canvas.width,
      box.top * canvas.height,
      box.width * canvas.width,
      box.height * canvas.height
    );
    URL.revokeObjectURL(localUrl);
    return canvas.toDataURL('image/png');
  } catch {
    return baseUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}
