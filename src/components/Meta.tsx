import { useEffect } from "react";

type Props = {
  title?: string;
  description?: string;
};

export default function Meta({ title, description }: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title + " • Naturverse";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    const prevDesc = meta.getAttribute("content") || "";
    if (description) meta.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      meta.setAttribute("content", prevDesc);
    };
  }, [title, description]);

  return null;
}
