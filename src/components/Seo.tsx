import Head from "next/head";

interface SeoProps {
  title: string;
  description?: string;
}

export default function Seo({ title, description }: SeoProps) {
  const siteName = "Naturverse";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc =
    description ||
    "A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.";

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={desc} />
    </Head>
  );
}
