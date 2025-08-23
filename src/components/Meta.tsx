import React, { useEffect } from "react";

type Props = { title?: string; description?: string; image?: string; url?: string };

export default function Meta({ title, description, image, url }: Props) {
  useEffect(() => {
    if (title) document.title = title;
    const set = (n: string, c: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${n}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    const setProp = (p: string, c: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${p}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", p); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    if (description) set("description", description);
    if (title) { setProp("og:title", title); setProp("twitter:title", title); }
    if (description) { setProp("og:description", description); setProp("twitter:description", description); }
    if (image) { setProp("og:image", image); setProp("twitter:image", image); }
    if (url) { setProp("og:url", url); }
    setProp("og:type", "website");
    setProp("twitter:card", "summary_large_image");
  }, [title, description, image, url]);

  return null;
}

