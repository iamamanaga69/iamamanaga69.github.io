# Flexist v2 — build kit

Everything needed to build the new Flexist site in an empty folder.

## How to use it

1. Copy this whole folder into the new empty project directory.
2. Open Claude Code (or any coding agent) there.
3. Paste: **"Read BUILD-PROMPT.md and everything it references, then build it."**
4. Answer the four questions in §18 of the brief. Then let it build.

The agent should read `BUILD-PROMPT.md` first — it points at every other file.

## What's here

```
BUILD-PROMPT.md              the brief. Start here.
README.md                    this file.

content/                     the only source of truth for copy and numbers
  brand.json                 identity, contacts, CTA labels, banned words
  copy.json                  headline, tagline, positioning, footer, point of view
  proof.json                 the three real stats, the five real clients
  services.json              six services — one-line summary + long body + deliverables
  work.json                  six real engagements with years, roles, metrics
  seo.json                   the seven service-page slugs (do not change them)

design/                      paste these in; don't redesign them
  tokens.css                 colour, type, space, radius, motion tokens + light theme
  tailwind.theme.ts          maps tokens into Tailwind, replaces the default palette
  layout.md                  the 12-column grid contract and section rhythm rules

assets/
  logo/mark.svg              F monogram, currentColor
  logo/wordmark.svg          static fallback only — render the wordmark as live text
  icon/favicon.svg           16px-legible, own dark ground
  icon/icon-maskable.svg     Android maskable, glyph inside the inner 66%
  icon/apple-touch-icon.png  192px
  hero/india-outline.svg     traced India outline (mapsicon, MIT) — the signature graphic
  hero/india-filled.svg      same path, 14% fill, for the light theme
  hero/hero-operator.png     existing brand image — 2.3MB, must be re-exported
  texture/grain.svg          3–5% overlay
  og/og-template.svg         OG layout reference / static fallback
  og/og-fallback.png         existing 1200×630
  images/                    brand-cover.jpg, avatar-full.png

starter/                     drop-in config — move to the project root at commit one
  vercel.json                pins framework: nextjs (this is what broke production before)
  .gitignore                 ignores .env.local from the very first commit
  .env.local.example         every env var, documented, no values

reference/
  craft-notes.md             the eight reference sites: what to take, and the 24
                             shipped defects to beat
```

## Rules that carry over from the last build

Three things went wrong before and are written into the brief so they can't repeat:

- **`vercel.json` must pin `"framework": "nextjs"`.** Production served a broken
  build because the preset was resolving to Astro's `dist/`.
- **Never boot a script on a bare `DOMContentLoaded`.** Guard on
  `document.readyState`. A missing guard rendered the entire site as a black
  screen, because every `.reveal` element stayed at `opacity: 0`.
- **`.env.local` and every Sanity token stay out of git.** The write token is read
  from `SANITY_API_WRITE_TOKEN` on the server only and is never exposed to the
  browser.

## The one thing not to compromise on

Only three numbers may appear on this site: 5.5+ years, 5+ projects, 10,000+
members. The reference agencies lead with "$500M+ raised" and "200+ projects" and
none of it is checkable. Flexist's advantage is the opposite — smaller numbers,
each attached to a named project, a year, a role, and a channel a founder can
open in a new tab. Inflating them trades the only real edge for a claim nobody
believes anyway.
