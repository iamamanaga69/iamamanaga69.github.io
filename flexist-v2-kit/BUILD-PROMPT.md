# Build brief — Flexist

Build the complete Flexist website and its admin backend from scratch in this
repo. Nothing is carried over from the old codebase.

Everything you need is in this folder. Read it before writing code:

```
content/     real copy, real numbers, real client history — the only source of truth
design/      tokens.css, tailwind.theme.ts, layout.md — paste these in, don't redesign
assets/      mark, favicon, maskable icon, wordmark, India outline, grain, OG template
reference/   craft-notes.md — what the reference sites do well, and the 24 defects to beat
```

`content/*.json` is the seed data. Every string in it is real and in use today.
You may cut and edit it. You may not add a claim that isn't there.

---

## 1. The two constraints

**Minimal.** The current site says far too much — 46 pages, a 14-section home
page, six funnels. This one says less and means more. Fewer pages, fewer
sections, fewer words, one accent. If a section doesn't change a founder's mind,
it isn't a section.

**It must not read as generated.** The finished site should look like the work of
a small, expensive studio that shipped it once and got it right. Section 3 is a
list of hard bans. Follow it literally — it is not advisory.

Everything below serves those two. When they conflict with something you'd
normally do, they win.

---

## 2. The agency, and the numbers

Identity, contacts, CTA labels, and the banned-word list: `content/brand.json`.
Real headline, tagline, positioning, footer line, point-of-view copy:
`content/copy.json`.

**The only numbers that may appear anywhere on this site** (`content/proof.json`):

- 5.5+ years in crypto
- 5+ projects delivered
- 10,000+ community members grown

Do not round them up. Do not add a dollar figure. Do not invent a fourth stat to
balance a grid — if the grid needs four, the grid is wrong.

Five real past clients: Fabwelt, RRG Ventures, Unielon Wallet, UXUY Wallet,
Maestro Bots. **No logo files exist and none may be fabricated.** Set them as
type in one restrained row.

`content/work.json` holds the six real engagements with years, roles, and
verifiable metrics. Read its `_framing` note first: these are engagements the
founder personally ran, not corporate contracts. Label the section honestly and
give every entry a role line. Two entries carry vague traction lines — either
replace them with a real number or drop the metric and keep role + years.

---

## 3. Hard bans — the tells

Never ship any of these.

**Colour and surface**
- Indigo / violet / purple gradients, and above all the Tailwind default
  `from-indigo-500 to-purple-600`. The single biggest giveaway on the web.
- Gradient text on more than one element per page.
- `rounded-2xl shadow-xl` on every card. Glow on everything. Glassmorphism as
  the answer to every surface.
- More than one accent hue.

**Layout**
- A three-across features grid of icon-library glyphs (lucide, heroicons) with a
  title and two lines under each.
- Every section built to the same rhythm: eyebrow → h2 → subtitle → 3 cards.
- Everything centre-aligned.
- Cards where a list would do. Most of this site is hairline-separated rows.

**Copy**
- Emoji, anywhere. In UI, in copy, in headings, in commit messages.
- "Elevate", "Unlock", "Seamlessly", "Empower", "Leverage", "Cutting-edge",
  "Game-changing", "Supercharge", "In today's fast-paced world", "We don't just
  X — we Y", "Let's build something amazing", "Transform your…", "Ready to take
  your brand to the moon".
- Exclamation marks. Bold for mid-sentence emphasis. Three adjectives where one
  works.
- Invented metrics, placeholder logos, lorem ipsum, "Company Name", TBD.

**Motion**
- Bouncy spring physics. A stagger-fade on every child of every container.
- Anything that re-animates when the user scrolls back up.

---

## 4. Do this instead

- **One accent**, on less than ~5% of visible surface. Everything else is the
  three greys and three inks in `design/tokens.css`.
- **Left-aligned, editorial, asymmetric.** Content spans columns 1–9 or 3–8, not
  1–12. `design/layout.md` has the column assignments. Ragged right is correct.
- **Hairlines, not shadows.** 1px at 8% opacity is the only elevation.
- **Mono micro-labels and numbered sections** (`01 / 02 / 03`) carry structure so
  decoration doesn't have to.
- **Let type do the work.** Four sizes, tight tracking on display, 1.65
  line-height on body, 66ch measure. That ratio is most of the "expensive" look.
- **One section that is mostly empty space.** Deliberate, not accidental.
- **Specifics over claims.** Name the client, give the number, state the year,
  link the channel.
- **Pick one typographic device and repeat it.** A bold/regular split heading, or
  a 45° terminal (the mark already uses one), or numerals in the left margin.
  One, used everywhere, is a design system. Three is noise.
- **A glyph convention with meaning.** `↗` for "read more", `→` for "convert".
  Two arrows, two jobs, never mixed.
- **Write the empty, loading, and error states.** In your own voice, not the
  framework's default string.
- **Grain.** `assets/texture/grain.svg` as a fixed `pointer-events:none` overlay
  at 3–5% opacity. A large flat dark surface reads as a template; grain doesn't.

## 5. Beat the references, don't match them

Read `reference/craft-notes.md` in full before building. It lists what the eight
named sites do well and the 24 shipped defects found across the five that were
readable — stale copyright years on three of five, lorem-ipsum slugs, alt text
containing raw URLs, duplicate placeholder cards, dead links, text baked into
PNGs, inverted heading outlines, `href="#"` on a primary CTA, an unrenamed
`Layer_1 (1).svg` wordmark, 27 logos repeated three times to fake a marquee.

The opportunity is not out-designing them. It is out-finishing them. Three rules
come straight from that list and are absolute:

1. The footer year is `new Date().getFullYear()`. Never a literal.
2. No text inside an image. Ever. Build it in HTML.
3. Nothing ships in a stub state. Cut the section instead.

And the strategic point: all five lead with scale they cannot prove ($500M+,
200+ projects, 10M+ users). Flexist cannot win that contest and must not enter
it. Change the frame to verifiability — every number attached to a named
project, a year, a role, and where possible a public channel a founder can open
in a new tab. None of the references has a line that specific.

---

## 6. Stack — use exactly this

- **Next.js** latest stable, App Router, React Server Components by default.
  A file gets `"use client"` only if it needs state, an event, or an observer.
- **TypeScript**, strict. No `any` in committed code.
- **Tailwind CSS** with `design/tailwind.theme.ts` — note it *replaces* the
  colour palette rather than extending it, so `bg-indigo-500` is unreachable.
- **Framer Motion** for reveals only.
- **Sanity v3**, embedded Studio at `/studio` — the admin portal for the whole
  site, not just a blog.
- **next-sanity** + GROQ, typed. Portable Text for long-form bodies.
- **Zod** at every input boundary, including CMS reads.
- **Vercel**. Ship `vercel.json`:
  `{ "$schema": "https://openapi.vercel.sh/vercel.json", "framework": "nextjs" }`
  (the previous build broke in production because this preset was wrong — it was
  resolving to an Astro `dist/` output.)

No UI kit, no component library, no icon package. If you need three icons, draw
three SVGs.

## 7. Design system

`design/tokens.css` goes in first, before any component. `design/layout.md` is
the grid contract. Do not invent a token; if something needs a value that isn't
there, that is a signal the design is wrong, not that the scale is short.

The accent is defined on exactly one line of `tokens.css` (`--accent: #00E5A0`, a
signal green — deliberately not the old site's cyan, and never purple). The light
theme uses a darker green because the dark-mode value fails AA on white. Ship
both themes, default dark, class on `<html>`, resolved before first paint so
there is no flash.

Type: **Bricolage Grotesque** display, **Inter** body, **JetBrains Mono** labels,
all via `next/font` with `display: swap` and preloaded subsets. Nothing
render-blocking.

The whole component vocabulary, and it is short:

`Button` (primary / quiet) · `MonoLabel` · `SectionHeading` (mono number +
heading) · `Panel` (hairline border) · `Stat` · `Row` (hairline-separated list
item) · `Accordion` · `Tag` · `Reveal` (the one motion wrapper) · `Field`.

Ten. If you reach for an eleventh, you have over-designed a section.

## 8. Assets — what's in the folder

| File | Use |
|---|---|
| `assets/logo/mark.svg` | The F monogram. `currentColor`, so it themes itself. Header, footer, favicon source. |
| `assets/logo/wordmark.svg` | **Static fallback only** — email, avatars. On the site, render the wordmark as live HTML text beside `mark.svg`. Do not ship it as the header logo image. |
| `assets/icon/favicon.svg` | Chunkier glyph on its own dark ground, legible at 16px. Wire as `app/icon.svg`. |
| `assets/icon/icon-maskable.svg` | Android maskable; glyph sits inside the inner 66%. |
| `assets/icon/apple-touch-icon.png` | 192px raster. |
| `assets/hero/india-outline.svg` | Traced India outline (mapsicon, MIT), `currentColor` stroke. The signature graphic. |
| `assets/hero/india-filled.svg` | Same path, 14% fill — for the light theme if the outline reads too thin. |
| `assets/hero/hero-operator.png` | Existing brand image, 2.3MB — **run it through `next/image` and re-export; do not ship it raw.** |
| `assets/texture/grain.svg` | 3–5% fixed overlay. |
| `assets/og/og-template.svg` | Layout reference for the dynamic OG route, and the static fallback. |
| `assets/og/og-fallback.png` | Existing 1200×630 OG image. |
| `assets/images/brand-cover.jpg`, `avatar-full.png` | Available for About / Journal. |

The accent hex appears in four SVGs (`favicon`, `icon-maskable`, `og-template`,
and the mark's usage). If the accent changes, change it in `tokens.css` and in
those files together.

## 9. Motion

- Opacity + `--reveal-y` (12px) translate. `--dur-1` (320ms) with `--ease`
  (`cubic-bezier(.16,1,.3,1)`). Never `ease` or `ease-in-out`.
- Reveal **once**, on enter, via `IntersectionObserver` with `once: true`.
- Never more than two things animating at once. No stagger deeper than 3 children
  at 60ms.
- `prefers-reduced-motion` is honoured completely — tokens already collapse
  duration to 1ms and translate to 0, and reveals must resolve to *visible*, not
  to hidden.
- **One** signature interaction on the entire site. Choose one and build it
  properly:
  - the India outline drawing itself once on load with a slow `stroke-dashoffset`,
    then holding still with 4–6 city nodes at low opacity; or
  - a hero word swap on a single noun, 2.5s dwell, crossfade only.

  Not both. Nothing else moves on its own.

## 10. Structure

Six top-level pages. Nothing else.

**Home · Work · Services (+ 7 detail pages) · About · Journal (+ post) · Contact**

No pricing page, no resources hub, no guides or case-study stubs, no separate
onboarding funnel, no `/experience`. Plans, if mentioned at all, are one quiet
block on Contact. Service detail pages stay because they earn search traffic —
slugs come from `content/seo.json` and **must not change**, or existing rankings
301 into nothing. Each is short: what it is, what you get, one proof point, one
CTA.

### Home — seven sections, hard cap

| # | Section | Content | Shape |
|---|---|---|---|
| 1 | Nav | Wordmark, 4 links, one CTA, theme toggle | Hairline bottom border, no dropdown |
| 2 | Hero | Headline, one line of sub-copy, one CTA | Cols 1–9, ragged right. No badge row, no stat strip |
| 3 | Proof | The three numbers, the five client names | One restrained row of type. Not cards |
| 4 | Services | The four `primary` services, one line each | Numbered hairline rows, `↗` to detail |
| 5 | Selected work | Unielon, UXUY, Maestro Bots | Text left, metric right, alternating |
| 6 | Point of view | `copy.json → pointOfView`, why India | The whitespace section. Cols 4–11, nothing else in it |
| 7 | Contact | One line, the CTA, the footer | Footer year computed |

No two adjacent sections may share a shape. If you can describe two in a row
with the same sentence, redesign one.

### The other pages

- **Work** — the six entries from `work.json` on one repeated template: client,
  years, role, hairline, outcome paragraph, metric, link to the live channel
  where one exists. Same shape every time; that repetition is the design.
- **Services** — all six as short rows, linking to the seven SEO detail pages.
- **About** — `copy.json → pointOfView`, mission, vision, values. One page, no
  team grid unless real names and photos are supplied.
- **Journal** — index and post. Server-rendered, GROQ filtered on
  `publishedAt <= now()` so future-dated posts stay hidden until due.
- **Contact** — the lead form, the direct channels, and at most one quiet block
  about how engagements start.

---

## 11. Admin portal — the entire site is editable

**Every word, number, image, link, and SEO field on the public site is editable
from the admin, with no code change and no redeploy.** Nothing user-facing is
hardcoded in JSX. If a string is in a `.tsx` file, that is a bug.

Build it as the embedded Sanity Studio at `/studio`.

### Schema

Singletons for pages, collections for repeating content.

- **`siteSettings`** — wordmark text, nav items (label + href + order), footer
  columns, contact email, Telegram / X / Linktree URLs, footer line, default OG
  image, meta title template, default meta description, accent hex override.
- **`homePage`** — hero headline, sub-copy, CTA label + href; the three stats
  (value + label); client names; services intro; point-of-view heading and body;
  **a visibility toggle per section**, so an editor can drop a section without a
  developer.
- **`service`** — title, slug, one-line summary, body (Portable Text),
  "what you get" list, proof point (reference → `caseStudy`), SEO fields, order,
  `primary` boolean (drives the Home four).
- **`caseStudy`** — client, years, role, one-line outcome, metric value + label,
  body, optional live-channel URL, image, order.
- **`aboutPage`** — headline, body, mission, vision, values, optional team entries.
- **`contactPage`** — headline, body, form intro, optional engagement block,
  success and error copy for the form (so the team can reword them).
- **`post`** — title, slug, category, description, body (Portable Text + images),
  `publishedAt`, SEO fields.
- **`lead`** — read-only in the Studio. Written only by the API. See §12.

### Studio requirements

- Organise the sidebar with `structureTool`: **Pages** (the singletons) ·
  **Content** (services, work, journal) · **Inbox** (leads) · **Settings**. A
  non-technical editor must find things without being taught.
- Every field carries a one-line `description` and real `validation`. Required
  where required, `max()` on meta title (60) and description (160).
- Custom `preview` on every document so lists read as content, not "Untitled".
- Images via the Sanity asset pipeline with hotspot. **Alt text is required, with
  a minimum length** — the reference sites shipped raw URLs as alt text; this is
  the field that prevents it.
- Singletons: no create button, no delete, one document each, `__experimental_actions`
  locked down.
- Slugs auto-generate from the title and are validated unique. Never hand-typed.
- `lead` is read-only: no create, no edit, no publish action.
- Field groups and ordering mirror how the page reads top to bottom.
- Studio auth is Sanity's own login plus project roles. Do **not** build custom
  auth, and do not leave `/studio` publicly writable.

### Editing experience

- **Draft preview.** Wire Next.js draft mode so an editor sees unpublished
  changes at a secret URL, with a visible "exit preview" control.
- **Instant publish.** A Sanity webhook hits `POST /api/revalidate`, which
  verifies a shared secret and calls `revalidateTag` for the affected type. An
  edit is live in seconds — not on a 60s timer, never needing a redeploy.
- Public reads use the CDN (`useCdn: true`); draft reads use `useCdn: false`.
- **Fallback:** if the Sanity env vars are absent, the data layer serves
  `content/*.json` from this kit, so `npm run build` passes on a clean clone
  before the CMS exists. This is a real requirement, not a nice-to-have — build
  it first and the whole site can be built before Sanity is provisioned.
- Validate every CMS response with Zod at the boundary. A missing field must
  degrade to nothing rendered, never to a crashed page.

## 12. Backend

A few well-guarded route handlers. No separate server.

### `POST /api/lead` — the only public write endpoint

- Validate with Zod: name, email, project or company, Telegram handle, budget
  tier, message. `.strict()` — reject unknown fields.
- Budget tiers as fixed brackets, in a select, not a free-text field.
- Anti-spam, layered: a hidden honeypot field, a minimum time-to-submit
  (reject < 2s), a per-IP rate limit, and Vercel BotID on the route.
- Persist first: write a `lead` document to Sanity with the **server-only** write
  token so the team reads submissions in the same admin Inbox.
- Then notify: Telegram `sendMessage` to the team chat, and an email via Resend.
  A notification failure must not lose the lead — persist, then notify, then log
  failures server-side.
- Idempotency: ignore an identical submission from the same IP inside 60s.
- Respond with a generic success or a generic failure, in copy pulled from
  `contactPage`. Never leak a stack trace, a provider error, or whether an
  address is already known.
- If the multi-step form pattern is used, **step 2 is not in the DOM until step 1
  validates** — one of the reference sites renders both panes at once.

### `POST /api/revalidate` — Sanity webhook target

Verify the webhook secret before doing anything else. Revalidate only the tags
affected by the document type in the payload. Reject everything else with 401.

### Draft mode — `GET /api/draft/enable`, `/api/draft/disable`

Gated by `SANITY_PREVIEW_SECRET`. Validate the redirect target is a same-origin
path before redirecting.

### `GET /api/og` — dynamic Open Graph images

From CMS fields, using `assets/og/og-template.svg` as the layout. Cache it.

### Non-negotiable

- Every secret is server-only. Nothing sensitive is ever `NEXT_PUBLIC_`.
- Every route validates input, sets an explicit status, and is rate-limited if
  publicly reachable.
- No public endpoint may read or list `lead` data. The Inbox is behind Studio auth.
- Log errors server-side with enough context to debug. Return nothing internal.
- State the auth posture of every route in a comment at the top of the file.

### Environment

Document all of these in `.env.local.example`. Commit **no values**.
`.env.local` is git-ignored in the first commit.

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_WRITE_TOKEN        # server only — writes leads
SANITY_API_READ_TOKEN         # server only — draft mode
SANITY_REVALIDATE_SECRET      # server only
SANITY_PREVIEW_SECRET         # server only
TELEGRAM_BOT_TOKEN            # server only
TELEGRAM_CHAT_ID              # server only
RESEND_API_KEY                # server only, optional
```

## 13. SEO

- One metadata helper. Per-page title, description, canonical, OG, Twitter — all
  from the CMS, falling back to `siteSettings`.
- JSON-LD: `Organization` + `WebSite` on Home, `Service` on service pages,
  `Article` on Journal posts, `BreadcrumbList` where it helps. No `FAQPage`
  without real FAQs on the page.
- Generated `sitemap.ts` and `robots.ts` — never hand-maintained files. The
  sitemap is built from CMS content so new pages appear automatically. Disallow
  `/studio`.
- Keep the seven service slugs from `content/seo.json` byte-identical to the
  current site.
- One `h1` per page. Headings descend in order — write a test that asserts it.

## 14. Accessibility and performance

- Semantic landmarks, visible focus rings (`--focus`, 2px, 2px offset), AA
  contrast in **both** themes, keyboard-operable nav / accordion / form / dialog.
- Real alt text from the CMS. No decorative image without `alt=""`.
- Every interactive element has an accessible name. No `href="#"` — a control
  that opens a dialog is a `<button>`.
- Budget: LCP under 2.0s on a throttled 4G run, CLS under 0.02, no layout shift
  from font swap (size-adjust or a metric-matched fallback). Lighthouse
  performance and accessibility both 95+.
- Ship no image over 250KB. The 2.3MB hero PNG in `assets/` gets re-exported.

## 15. Client-side JavaScript

Prefer React and Framer Motion. If any vanilla script must run on load, guard the
boot. A bare `DOMContentLoaded` listener silently never fires when the script is
injected after the DOM is already parsed — that took the previous build to a
fully blank page in production, because every `.reveal` stayed at `opacity: 0`:

```js
if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);
```

Do not put the initial reveal state in CSS-only `opacity: 0`. If JS fails, the
content must still be visible — set the hidden state from JS, or use
`@media (scripting: none)` to force visibility.

## 16. Build order

1. Scaffold Next + TS + Tailwind. Get a clean `npm run build` before writing a
   page. Move `starter/vercel.json`, `starter/.gitignore`, and
   `starter/.env.local.example` to the project root and commit those **first**,
   before any secret exists.
2. Paste `design/tokens.css` and `design/tailwind.theme.ts`. Wire the fonts, the
   theme class, the grain overlay, the icons from `assets/`.
3. Build the ten components in §7 on a `/kitchen-sink` route. Delete that route
   before shipping.
4. Define the **full** Sanity schema and the typed, Zod-validated data layer with
   the `content/*.json` fallback — **before** any page. This is what guarantees
   no page hardcodes copy.
5. Build Home to a finished standard. It sets the bar; nothing after it may be
   rougher.
6. Build the remaining five page types. Resist every section not in §10.
7. Add the backend routes, webhook revalidation, and draft preview.
8. `npm run build`, then walk every route: nothing stuck at `opacity: 0`, no
   console errors, no layout shift, both themes, keyboard-only pass.
9. Test the lead form end to end: valid, invalid, honeypot tripped, too-fast
   submit, rate limit, duplicate, and a lead visible in the Studio Inbox.
10. README: local setup, the Sanity checklist (create project, set env vars, add
    the webhook), how to edit each page, how to deploy.

## 17. Done means

- [ ] Every public string, number, image, and link is editable in `/studio`.
- [ ] Publishing in the Studio is live within seconds, with no redeploy.
- [ ] Home has 7 sections. The site has 6 top-level pages.
- [ ] Zero items from §3 appear anywhere. Grep the build output for `indigo`,
      `purple`, `rounded-2xl`, `shadow-xl`, and the banned words.
- [ ] The seven service slugs are unchanged from `content/seo.json`.
- [ ] Footer year is computed. No stale year, no lorem, no dead link, no stub.
- [ ] Alt text is required in the CMS and no alt attribute contains a URL.
- [ ] One `h1` per page; heading order asserted by a test.
- [ ] No secret in the client bundle. `.env.local` untracked from commit one.
- [ ] `npm run build` clean, zero type errors. Lighthouse 95+ on both.
- [ ] `prefers-reduced-motion` renders everything visible and still.
- [ ] A stranger reading the site cannot tell it was generated.

## 18. Ask first

Everything factual is in `content/`. Four things are genuinely missing — ask,
don't invent:

1. **Accent colour** — `#00E5A0` is the default in `tokens.css` and the SVGs. Keep
   or replace.
2. **The two vague work entries** — RRG Ventures and Fabwelt need a real number or
   the metric gets cut (`content/work.json → _todo`).
3. **Live channel URLs** per case study, for the verifiability play in §5.
4. **`TELEGRAM_CHAT_ID`**, and whether Resend is wanted for email at launch.

Then build.
