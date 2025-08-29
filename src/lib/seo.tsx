import { Helmet } from "react-helmet-async";

export function metaTag({ title, desc }: { title?: string; desc?: string }) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {desc && <meta name="description" content={desc} />}
      {title && <meta property="og:title" content={title} />}
      {desc && <meta property="og:description" content={desc} />}
    </Helmet>
  );
}
