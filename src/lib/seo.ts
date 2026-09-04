import type { Metadata } from 'next';

const SITE = 'https://flexist.in';
const DEFAULT_OG = '/assets/images/flexist-og.png';

interface SeoInput {
  title: string;
  description: string;
  canonical?: string; // path or absolute URL; defaults to site root
  ogImage?: string;
  robots?: string; // e.g. "noindex, nofollow"
}

/** Mirrors the old Layout.astro <head>: title, description, canonical, OG, Twitter, robots. */
export function buildMetadata({ title, description, canonical, ogImage = DEFAULT_OG, robots }: SeoInput): Metadata {
  const url = !canonical ? `${SITE}/` : canonical.startsWith('http') ? canonical : `${SITE}${canonical}`;
  const meta: Metadata = {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Flexist',
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
  if (robots) {
    const noindex = /noindex/i.test(robots);
    const nofollow = /nofollow/i.test(robots);
    meta.robots = { index: !noindex, follow: !nofollow };
  }
  return meta;
}
