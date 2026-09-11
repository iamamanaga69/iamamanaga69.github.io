Build a complete marketing website for a marketing agency from scratch. This is a
fresh project in an empty repo.

## The agency
- Name: {{AGENCY_NAME}}
- One-line pitch: {{e.g. "B2B SaaS growth agency for early-stage startups"}}
- Niche / focus: {{e.g. paid search, content marketing, brand design, Web3, local SEO}}
- Target customer: {{who they sell to}}
- Core services (3–6): {{list them, one line each}}
- Tone: {{e.g. bold and technical / warm and approachable / premium and minimal}}
- Primary CTA: {{e.g. "Book a call", "Request a proposal"}}
- Contact: {{email}}, {{socials — X/LinkedIn/Instagram/etc.}}
- Domain (if known): {{example.com}}

## Tech stack (use exactly this)
- Next.js 14, App Router, TypeScript, React Server Components by default
- Tailwind CSS for styling; Framer Motion for animation
- Sanity CMS (v3) embedded Studio at /studio for the blog only
- next-sanity + GROQ for blog data; portable text for article bodies
- Deploy target: Vercel (framework preset = nextjs)

## Site structure
Pages: Home, Services (with a detail page per service), About, Work/Case Studies,
Pricing/Plans, Blog (index + article), Contact.
- Blog lives at /blog and /blog/[slug], rendered server-side (revalidate every 60s)
  so new posts appear without a redeploy. Support scheduled posts: filter GROQ on
  `publishedAt <= now()` so future-dated posts stay hidden until due.
- Graceful degradation: the blog data layer must fall back to bundled sample JSON
  posts when Sanity env vars aren't set yet, so the build passes before Sanity is
  wired up.

## Content model
Drive all marketing copy (hero, services, pricing, about, testimonials) from typed
data files or Sanity — NOT hardcoded in markup — so it's editable in one place.
Blog posts are Sanity documents: title, slug, cluster/category, description, body
(portable text + images), publishedAt.

## Design system
- Define color, type, spacing, and radius tokens as CSS variables / Tailwind theme.
  Support light + dark themes via a class on <html>, defaulting to {{light or dark}}.
- Pick a cohesive font pairing (a display face for headings, a clean body face).
- Build a reusable class/component vocabulary: buttons (primary/ghost), cards,
  section labels, section titles, grids, and a scroll-reveal animation used site-wide.
- Fully responsive, mobile-first, accessible (semantic HTML, alt text, focus states,
  respects prefers-reduced-motion).

## SEO
- Central metadata helper: per-page title, description, canonical, Open Graph, Twitter.
- JSON-LD: Organization + WebSite on home, Service on service pages, Article on blog
  posts, BreadcrumbList where it helps.
- Generate sitemap.xml and robots.txt (disallow /studio). Use next/sitemap or a route.

## Client-side scripts
If you write any vanilla JS that runs on load, guard the boot so it works whether the
DOM is already parsed or not:
`if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);`
Prefer React/Framer Motion over injected scripts where possible.

## Security & config
- Never commit .env.local or any API token. The Sanity write token is read from
  `SANITY_API_WRITE_TOKEN` (server env only) and is never exposed to the browser.
- Add a .env.local.example documenting: NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.
- Add vercel.json with { "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs" }.
- Any network-exposed API route must state whether it needs auth; don't silently
  ship unauthenticated endpoints.

## How to work
1. Scaffold the Next.js + Tailwind + TypeScript project and get a clean build first.
2. Build the design system and shared layout (nav, footer, head/SEO) before pages.
3. Build pages using placeholder-but-realistic copy from the details above.
4. Add Sanity Studio + the blog schema + the JSON-fallback data layer.
5. Run `npm run build` and fix all errors before calling anything done.
6. Give me a README with setup steps, the Sanity setup checklist, and deploy steps.

Ask me for any detail above that's missing before you start, then build.
