import { useEffect } from "react";

type Props = { title?: string; description?: string; image?: string; url?: string };
export default function Meta({ title, description, image, url }: Props) {
  useEffect(() => {
    if (title) document.title = title;
    const set = (n: string, c: string) => {
      let el = document.querySelector(`meta[name="${n}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    if (description) set("description", description);
    const setProp = (p: string, c: string) => {
      let el = document.querySelector(`meta[property="${p}"]`) as HTMLMetaElement|null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", p); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    if (title) setProp("og:title", title);
    if (description) setProp("og:description", description);
    if (image) setProp("og:image", image);
    if (url) setProp("og:url", url);
  }, [title, description, image, url]);

  return null;
}
