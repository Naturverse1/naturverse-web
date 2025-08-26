export async function smartShare(opts: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<"shared" | "copied" | "unsupported" | "error"> {
  const url = opts.url ?? window.location.href;
  const title = opts.title ?? document.title;
  const text = opts.text ?? "";

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return "shared";
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return "copied";
    }
    return "unsupported";
  } catch {
    return "error";
  }
}
