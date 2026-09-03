# CLAUDE.md

Project fundamentals for **flexist.in** — the marketing site for Flexist, an India-focused Web3 marketing & community-growth agency (Telegram community management, KOL campaigns, ambassador programs, India market entry).

---

## Critical conventions — read these first

These are the things that are easy to get wrong:

1. **Client JS lives in `src/scripts/`, NOT `public/scripts/`.** `public/scripts/` is **git-ignored and auto-generated** — the `copy:scripts` step (a `predev`/`prebuild` hook) copies `src/scripts/*` → `public/scripts/*`. Pages load them by their served path (`<script is:inline src="/scripts/foo.js">`). **Always edit `src/scripts/`**; edits to `public/scripts/` are wiped on the next build.
2. **There is no `src/components/` directory.** The only Astro component is `src/layouts/Layout.astro`. Every page assembles its UI as **inline HTML directly in its `.astro` file**. Reuse happens through shared **CSS classes** (`src/styles/`) and shared **vanilla-JS behaviors** (`src/scripts/`), not components.
3. **Content is data-driven from `src/data/*.json`.** To change copy/pricing/services/blog, edit the JSON — not the markup (with exceptions noted under "Watch-outs").
4. **Nav, footer, `<head>`/SEO, and social links are all hardcoded in `src/layouts/Layout.astro`.** That's the single place to edit navigation, footer "Route Map" columns, and the shared head.
5. **Every push to `main` deploys.** It triggers **two** website pipelines at once — GitHub Pages (Actions) and Vercel. **Vercel serves the live domain.** (See Deployment.)
6. **The payment backend is a separate Cloudflare Worker**, deployed independently via `wrangler` — it is NOT part of the push-to-main flow.
7. **No `tsconfig.json`, no linter, no formatter, no `devDependencies`.** Match existing code style by hand.

---

## Commands

```bash
npm install
npm run dev        # predev copies src/scripts → public/scripts, then astro dev @ http://localhost:4321  (admin at /admin)
npm run build      # prebuild copies scripts, then astro build → dist/
npm run preview    # serve the built dist/
```

Package manager is **npm** (`package-lock.json`). Node 20 is used in CI.

---

## Tech stack

- **Astro 4.16.19**, `output: 'static'` (pure SSG). `astro.config.mjs` is minimal: just `site: 'https://flexist.in'` + `output: 'static'`.
- **Vercel Analytics + Speed Insights** — `<Analytics />` and `<SpeedInsights />` rendered in `Layout.astro`.
- **Decap CMS** (Git-based) at `/admin` — edits `src/data/*.json` and commits to the repo.
- **Cloudflare Worker** payment backend (`worker.js`, `wrangler.toml`, `schema.sql`).
- `@astrojs/vercel` is a dependency but **not wired into the config** (no adapter; output is static) — effectively vestigial. Vercel builds this as a plain static Astro site.
- No `@astrojs/sitemap` — the sitemap is a **hand-authored** static file.

---

## Directory layout

```
src/
  pages/        # routes (see Routes). Includes dynamic services/[slug] and resources/blog/[slug]
  layouts/
    Layout.astro   # the ONLY component: <head>/SEO, nav, footer, global scripts
  data/         # *.json content + indiaOutline.js  (single source of truth for content)
  scripts/      # 19 vanilla-JS files — SOURCE OF TRUTH for client JS
  styles/       # global + per-page CSS
public/
  admin/        # Decap CMS (index.html + config.yml)
  assets/images/  # 5 brand images
  scripts/      # GENERATED copy of src/scripts (git-ignored)
  CNAME         # flexist.in (GitHub Pages custom domain)
  robots.txt, sitemap.xml   # both hand-maintained
astro.config.mjs
worker.js, wrangler.toml, schema.sql   # Cloudflare Worker payment backend (separate deploy)
.github/workflows/deploy.yml           # GitHub Pages pipeline
```

---

## Deployment

**Live domain `flexist.in` is served by Vercel** (`server: Vercel`, DNS → `76.76.21.21`). Git remote is `github.com/iamamanaga69/iamamanaga69.github.io`.

A push to `main` (or a Decap CMS publish, which commits JSON to the repo) runs **both**:
- **Vercel** — Git-integration auto-build (`astro build` → serves `dist/`). **This is the production surface.** Usually live in ~1–2 min.
- **GitHub Pages** — `.github/workflows/deploy.yml`: Node 20 → `npm install` → copy scripts → `astro build` → upload `dist/` → deploy to Pages. Custom domain via `public/CNAME`. This is a legacy pipeline that still runs but does not serve live traffic.

**Payment backend (separate):** Cloudflare Worker **`flexist-payment-verifier`** — KV `VERIFIED_TXIDS`, D1 `flexist-db`, Telegram bot vars. Deployed manually with `wrangler`. `payment.js` calls its `*.workers.dev` endpoint.

If a change "isn't showing," it's almost always **browser cache** — hard-refresh (Ctrl+Shift+R) or check the served CSS/HTML directly.

---

## Routes (46 built HTML pages)

All pages wrap `Layout.astro`. Nav: **Home · FlexistLabs · Services · Resources · Plans (dropdown) · Experience · About · Contact** + CTAs to `/inquiry`.

**Static:** `/` (home), `/about`, `/contact`, `/experience`, `/flexistlabs`, `/services`, `/inquiry`, `/plans` + `/plans/india-entry|india-growth|india-partner`, `/resources` + `/resources/blog` + `/resources/guides` + `/resources/case-studies`.

**Private funnel (noindex,nofollow):** `/payment`, `/payment/status`, `/payment/thank-you`, `/onboarding/welcome`, `/onboarding/brief`, `/onboarding/portal`.

**Dynamic:**
- `services/[slug].astro` → **7** SEO service pages from `seoServices.json` (`telegram-community-management`, `web3-marketing-agency-india`, `kol-influencer-marketing-india`, `crypto-marketing-agency-india`, `ambassador-program-management`, `india-market-entry-services`, `web3-community-building`).
- `resources/blog/[slug].astro` → **18** blog articles from `blogArticles.json` (4 clusters).

---

## Data model (`src/data/`)

| File | Drives | Notable keys |
|---|---|---|
| `homepage.json` | Home hero, stat counters, marquee | `hero_title`, `hero_tagline`, `hero_copy`, `stats{}`, `marquee_projects[]` |
| `about.json` | `/about` | `manifesto_title`, `manifesto_copy[]`, `mission`, `vision`, `values` |
| `services.json` | `/services` (6 core services) | `services[]{id,index,title,description,what_you_get[]}` |
| `seoServices.json` | `/services/{slug}` (7 SEO pages) | `slug`, `keyword`, `metaTitle`, `h1`, `includes[]`, `faqs[]`, `related[]` |
| `plans.json` | `/plans` comparison (3 tiers) | `plans[]{id,name,price_one,price_monthly,features[]}` |
| `experience.json` | `/experience` timeline (6 projects) | `projects[]{company,date_range,role,is_current,bullets[],traction,tags[]}` |
| `blogArticles.json` | blog index/hub/articles (18) | `slug`, `cluster`, `title`, `description`, `service`, `intro` |
| `global.json` | intended global contact/socials | `contact_email`, `telegram_url`, `x_url`, `linktree_url`, `footer_copy` — **currently NOT consumed by Layout** |
| `indiaOutline.js` | Home India signal-map SVG geometry | `INDIA_OUTLINE = {viewBox, transform, d}` |

CMS field mapping: `public/admin/config.yml` (collections → homepage/services/experience/about/plans/global).

---

## Layout.astro props

`title` (req), `description` (req), `canonical?` (default `https://flexist.in/`), `ogImage?` (default `/assets/images/flexist-og.png`), `pageId?` (drives nav active state + `<body data-page>`), `robots?` (default `index, follow`), `schema?` (`object | object[]` → JSON-LD), `preloadImage?`. Also provides a `<slot name="head" />` for per-page head injection.

---

## Design system

Dark-first, neon-on-near-black glassmorphism. Tokens in `global.css :root`; a light theme redefines the same tokens under `html[data-theme="light"]`.

- **Colors:** `--bg-primary:#020408`, `--text-primary:#f0f4ff`, accents `--accent-cyan:#00d4ff` / `--accent-blue:#0066ff` / `--accent-green:#00ff88` / `--accent-purple:#7b2fff`, glass/border/glow tokens, plus canvas RGB triplets (`--network-node-rgb`, `--network-edge-rgb`).
- **Layout tokens:** `--nav-height:76px` (66px ≤720px), `--container:1200px`, `--ease-out`, card shadows. No formal spacing/radius scale — radii are inline literals.
- **Fonts** (Google Fonts, loaded non-render-blocking in `Layout.astro`): **Bricolage Grotesque** = display (`--font-display`), **Inter** = body, **JetBrains Mono** = mono/labels, **Syne** = accent/wordmark. Global rule: `h1,h2,h3 { font-family: var(--font-display) }` — so all headings are Bricolage Grotesque (no per-heading font overrides).
- **Theme toggle:** `[data-theme-toggle]` in nav; logic in `src/scripts/global.js`. Precedence: `?theme=` param → `localStorage["flexist-theme"]` → `prefers-color-scheme`, default dark. Applying a theme dispatches `window` event `flexist:themechange`, which the canvas scripts listen to for live re-coloring. (Applied on `DOMContentLoaded`, so a light reload can briefly flash dark.)
- **`.performance-mode`** — auto-added on low-end/reduced-motion devices; flattens glass, kills glows/backdrop-filter.

**Reusable class vocabulary:** `.container`, `.glass-card` (+`.hoverable`), `.neon-button`, `.ghost-button`, `.section-label`, `.section-title` / `.page-title`, `.gradient-text`, `.grid-2/3/4`, `.reveal` (+`-left/right/scale/blur`, `.reveal-stagger`), `.stat-counter`, `.accordion`, `.logo-marquee`, `.icon-box`, `.terminal-box`, `.cta-block`, `.tag-chip`, `.field`, `.data-table`, `.service-card`.

---

## Styles (`src/styles/`)

**Loaded globally by `Layout.astro`** (cascade order): `global.css` (tokens, reset, shell: nav/footer/container/sections), `components.css` (class vocabulary), `animations.css` (`.reveal`, keyframes, reduced-motion), `pages.css` (content-page primitives, accordions), `mobile-fixes.css` (**last-loaded** mobile override layer, mostly `@media (max-width:768px)`).

**Per-page** (imported in each page's frontmatter): `home.css`, `services.css`, `plans.css`, `payment.css` (largest), `contact.css`, `flexistlabs.css`, `inquiry.css`, `onboarding.css`, `experience.css`, `about.css`.

Responsive: **desktop-first**, `max-width` queries. Dominant breakpoint **768px**; also 480/720/980/1180. Fluid type via `clamp()`; grids collapse to 1 col ≤768px; touch inputs forced to 16px; one `prefers-reduced-motion` block.

---

## Client scripts (`src/scripts/`, 19 files)

**Global (every page, via Layout):**
- `global.js` — `Flexist` module: performance-mode detection, theme system, nav (scroll state + hamburger), scroll-reveal `IntersectionObserver`, accordions, footer subscribe stub, deferred Calendly badge. (Contains an unused `renderShell()` — the shell is server-rendered, so it's intentionally not called.)
- `fx.js` — `FlexistFX` premium effects: stagger reveals, scroll-progress bar, magnetic buttons, parallax, glass-card 3D tilt, cursor glow, hero letter-split, smooth counters, scrollspy. Heavy effects skip on low-end/touch.

**Home page** also loads: `network-graph.js` (particle network on `#network-canvas`), `counters.js` (count-up stats), `india-map.js` (animated dot-matrix India map + city nodes), `home.js` (boot + mini readiness form + carousel).

**Per-page:** `services.js`, `plans.js`, `payment.js` (`FlexistPayment` → Cloudflare Worker), `contact.js`, `inquiry.js`, `flexistlabs.js`, `onboarding.js`, `experience.js`. Files like `about.js`, `cursor.js`, `particles.js`, `inquiry-engine.js`, `timeline.js` are intentional one-line stubs (behavior consolidated elsewhere).

---

## SEO / schema

- **JSON-LD** injected centrally via the `schema` prop (Organization/WebSite/FAQPage on home; Service/FAQPage/BreadcrumbList on service pages; Article on blog; Service+Offer on plan detail pages). Pages without a `schema` prop emit none.
- **Canonical** passed per page (Layout defaults to root). **robots** per page via prop (payment/onboarding are `noindex,nofollow`; `/resources/guides` & `/resources/case-studies` are `noindex,follow` stubs).
- **`public/sitemap.xml` is hand-maintained** — new service/blog pages must be added to it by hand.
- `public/robots.txt` disallows `/admin/`, `/onboarding/`, `/payment/status`, `/payment/thank-you`.

---

## Watch-outs (known duplication / drift)

- **Plan prices live in 3+ places.** `plans.json` feeds `/plans` only; each `plans/india-*.astro` detail page hardcodes its own body copy **and** its own `planSchema` Offer prices. A price change means editing `plans.json` **plus** the three detail pages.
- **`global.json` is not consumed by `Layout.astro`.** Header/footer socials + email are hardcoded in the layout, so the JSON and the layout can drift. Edit socials in `Layout.astro`.
- **Sitemap is manual** (see SEO).
- **Two "service" vocabularies:** `services.json` ids (community/kol/consulting…) differ from `seoServices.json` slugs (keyword URLs). Deep links `/inquiry?service={slug}` use the **seoServices** slugs.
- **Decap CMS** commits to `iamamanaga69/iamamanaga69.github.io` (the actual git remote), which then triggers the normal dual deploy — expected, not a bug.
