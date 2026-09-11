# Flexist.in Development Guide

**Last Updated:** September 11, 2026  
**Project:** flexist.in (Web3 Marketing Agency Website)  
**Tech Stack:** Astro 4.16.19 (Static Site Generator)  
**Deployment:** Vercel (production) + GitHub Pages (backup)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Recent Changes (Sept 2026)](#recent-changes-sept-2026)
3. [Architecture & File Structure](#architecture--file-structure)
4. [Design System](#design-system)
5. [Animation System](#animation-system)
6. [Content Management](#content-management)
7. [Deployment Process](#deployment-process)
8. [Pending Work](#pending-work)
9. [Known Issues & TODOs](#known-issues--todos)
10. [Development Environment](#development-environment)

---

## Project Overview

Flexist.in is the official website for **Flexist**, a Web3 marketing agency specializing in India market entry, Telegram community management, and growth consulting for crypto projects.

**Business Context:**
- Founder: Aman (iamamanaga69 on GitHub)
- Services: India market expansion, community management, KOL campaigns, ambassador programs
- Target: Web3/crypto projects wanting to enter the Indian market
- Contact: owner@flexist.in (updated from FlexistCrypto@gmail.com on Sept 11, 2026)

**Live Site:** https://flexist.in  
**Repository:** https://github.com/iamamanaga69/iamamanaga69.github.io

---

## Recent Changes (Sept 2026)

### September 11, 2026 - Premium UI Enhancements

#### 1. **Blank Box Fix (Hero Section)**
- **Issue:** Visible empty box around the hero image caused by `.hero-command-card.glass-card` wrapper
- **Root Cause:** The `<aside>` element had glass-card styling (gradient background, border, glow) creating a visible bordered box
- **Fix:** 
  - Changed `<aside class="hero-command-card glass-card">` to `<div class="hero-visual">`
  - Removed glass-panel styling from `.hero-brand-art`
  - Set `margin: 0; padding: 0; background: transparent; border: none; box-shadow: none;`
  - Removed default `<figure>` browser margin (`margin: 1em 40px`)
- **Files Modified:**
  - `src/pages/index.astro` (line 59)
  - `src/styles/home.css` (`.hero-brand-art`, `.hero-visual` sections)
  - `src/styles/mobile-fixes.css` (updated `.hero-command-card` → `.hero-visual`)
- **Commits:** `3bfd9fa`, `42831b9`

#### 2. **Email Migration**
- **Change:** `FlexistCrypto@gmail.com` → `owner@flexist.in`
- **Files Updated:**
  - `src/pages/contact.astro`
  - `src/pages/inquiry.astro`
  - `src/pages/index.astro` (schema.org metadata)
  - `src/data/global.json`
  - `src/scripts/global.js`
  - `src/layouts/Layout.astro`
  - `src/scripts/inquiry.js`
- **Commit:** `1896494`

#### 3. **Premium Animation System**
- **New Features:**
  - Spotlight cursor glow effect on cards (follows mouse position)
  - Text shimmer effect on section titles (gradient sweep on scroll)
  - Grain/noise texture overlay for depth
  - Counter pulse animation (bounces when counter finishes)
  - Smooth anchor scrolling with lerp
  - Marquee pause on hover
  - Enhanced section reveal animations

- **New Files:**
  - `src/scripts/premium-fx.js` (cursor tracking, spotlight, grain overlay, counter pulse, smooth scroll)
  - `src/styles/premium-fx.css` (spotlight, shimmer, grain, counter pulse styles)

- **Key Features:**
  - Uses CSS custom properties (`--spot-x`, `--spot-y`, `--spot-opacity`)
  - GPU-accelerated (transform/opacity only)
  - Performance mode fallback (disables heavy effects on low-end devices)
  - Respects `prefers-reduced-motion`

- **Integration:**
  - Added to `src/layouts/Layout.astro`:
    ```astro
    <link rel="stylesheet" href="/styles/premium-fx.css" />
    <script src="/scripts/premium-fx.js" defer></script>
    ```

- **Commit:** `ff6d20a`

#### 4. **Hero Image & Footer Enhancements**
- **Hero Image:**
  - Increased from 380px to 480px max-width
  - Grid column adjusted from `0.55fr` to `0.62fr`
  - Better visual balance with text content

- **Footer Logo:**
  - Added Flexist icon logo in right column
  - Uses `flexist-icon.svg` (512x512, SVG with gradient design)
  - 120px size with glow effect on hover
  - CSS: `.footer-logo` with `filter: drop-shadow()` for glow
  - Responsive: scales to 80px on mobile

- **Commit:** `ff6d20a`

### September 10, 2026 - Typography Fixes

- Reduced all heading sizes (h1, h2, h3) across the site
- Fixed oversized typography that looked "messy" on desktop
- Adjusted clamp() values for better responsive scaling
- Mobile typography refinements in `mobile-fixes.css`

---

## Architecture & File Structure

### Core Architecture

```
flexist.in/
├── src/
│   ├── pages/              # Astro pages (routes)
│   ├── components/         # Astro components (layouts, sections)
│   ├── layouts/            # Layout components (Layout.astro)
│   ├── data/               # JSON content files
│   ├── scripts/            # Client-side JavaScript
│   └── styles/             # CSS files (global, animations, pages)
├── public/                 # Static assets (images, fonts, admin/)
├── dist/                   # Build output (generated)
├── worker.js               # Cloudflare Worker (payment verification)
├── wrangler.toml           # Cloudflare Worker config
└── astro.config.mjs        # Astro configuration
```

### Key Files

#### Pages (`src/pages/`)
- `index.astro` - Homepage
- `about.astro` - About page
- `services.astro` - Services listing
- `services/[slug].astro` - Dynamic service pages (7 services)
- `contact.astro` - Contact form
- `inquiry.astro` - Inquiry form (lead capture)
- `experience.astro` - Experience/timeline
- `flexistlabs.astro` - FlexistLabs program
- `plans.astro` - Pricing plans
- `plans/[plan].astro` - Individual plan pages
- `resources.astro` - Resources hub
- `resources/blog/[slug].astro` - Blog posts (18 articles)

#### Layouts (`src/layouts/`)
- `Layout.astro` - Main layout (nav, footer, meta tags, fonts)
  - Loads all global CSS files in order:
    1. `global.css` (CSS variables, resets)
    2. `components.css` (reusable components)
    3. `animations.css` (reveal animations, keyframes)
    4. `premium-fx.css` (spotlight, shimmer, grain)
    5. `pages.css` (page-specific styles)
    6. `mobile-fixes.css` (mobile overrides - MUST BE LAST)

#### Data (`src/data/`)
- `homepage.json` - Homepage content
- `services.json` - Service cards
- `seoServices.json` - SEO service pages (7 services with slugs)
- `blogArticles.json` - Blog posts (18 articles, 4 clusters)
- `plans.json` - Pricing plans
- `experience.json` - Timeline data
- `global.json` - Global settings (email, social links)
- `indiaOutline.js` - India map SVG data

#### Scripts (`src/scripts/`)
- `global.js` - Theme system, nav scroll state, reveal animations
- `fx.js` - Legacy animation engine (stagger, scroll progress, magnetic buttons, parallax, card tilt, mouse glow, hero text split, smooth counters)
- `premium-fx.js` - **NEW** Premium effects (spotlight, shimmer, grain, counter pulse, smooth scroll)
- `counters.js` - Stat counter animations
- `network-graph.js` - Network graph visualization
- `india-map.js` - India signal map
- `home.js` - Homepage carousel
- `services.js` - Services page interactions
- `plans.js` - Plans page interactions
- `payment.js` - Payment flow
- `contact.js` - Contact form
- `inquiry.js` - Inquiry form
- `flexistlabs.js` - FlexistLabs interactions
- `onboarding.js` - Onboarding flow
- `experience.js` - Experience timeline

#### Styles (`src/styles/`)
- `global.css` - CSS variables, resets, typography, nav, footer
- `components.css` - Buttons, cards, forms, grids
- `animations.css` - Reveal system, keyframes, stagger
- `premium-fx.css` - **NEW** Spotlight, shimmer, grain, counter pulse
- `pages.css` - Page-specific styles
- `mobile-fixes.css` - Mobile overrides (loaded last)
- `home.css` - Homepage styles
- `services.css` - Services page
- `plans.css` - Plans page
- `payment.css` - Payment flow
- `contact.css` - Contact page
- `inquiry.css` - Inquiry form
- `flexistlabs.css` - FlexistLabs
- `onboarding.css` - Onboarding
- `experience.css` - Experience timeline
- `about.css` - About page

### CSS Load Order (Critical)

The order matters because `mobile-fixes.css` must override everything else:

```astro
<link rel="stylesheet" href="/styles/global.css" />
<link rel="stylesheet" href="/styles/components.css" />
<link rel="stylesheet" href="/styles/animations.css" />
<link rel="stylesheet" href="/styles/premium-fx.css" />
<link rel="stylesheet" href="/styles/pages.css" />
<link rel="stylesheet" href="/styles/mobile-fixes.css" />
```

---

## Design System

### Color Palette (CSS Variables in `global.css`)

```css
:root {
  /* Backgrounds */
  --bg-primary: #020408;
  --bg-secondary: #080d14;
  --bg-card: #0a1020;
  --bg-glass: rgba(10, 20, 40, 0.62);
  
  /* Accent Colors */
  --accent-blue: #0066ff;
  --accent-cyan: #00d4ff;
  --accent-purple: #7b2fff;
  --accent-green: #00ff88;
  --accent-red: #ff5774;
  
  /* Text */
  --text-primary: #f0f4ff;
  --text-secondary: #7a8aaa;
  --text-muted: #3a4a6a;
  
  /* Borders */
  --border-subtle: rgba(0, 180, 255, 0.1);
  --border-glow: rgba(0, 180, 255, 0.3);
  
  /* Glows */
  --glow-blue: 0 0 34px rgba(0, 102, 255, 0.18);
  --glow-cyan: 0 0 26px rgba(0, 212, 255, 0.12);
  
  /* Typography */
  --font-display: "Bricolage Grotesque", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-accent: "Syne", sans-serif;
}
```

### Typography Scale

```css
/* Headings */
h1, .page-title {
  font-size: clamp(2.2rem, 5vw, 3rem);
}

h2, .section-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
}

h3 {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
}

/* Body */
.hero-tagline {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
}

.hero-copy, p {
  font-size: 1rem;
}
```

### Spacing & Layout

- Container max-width: 1200px
- Nav height: 76px desktop, 66px mobile
- Breakpoints: 768px (mobile), 480px (small mobile)
- Grid gaps: 48px desktop, 24px mobile

### Components

#### Glass Card
```css
.glass-card {
  background: linear-gradient(145deg, var(--glass-start), var(--glass-end));
  border: 1px solid var(--border-glow);
  border-radius: 18px;
  box-shadow: var(--glow-blue);
  backdrop-filter: blur(8px);
}
```

#### Buttons
- `.neon-button` - Primary CTA (blue gradient, glow on hover)
- `.ghost-button` - Secondary CTA (outline, cyan border on hover)

#### Reveal Animations
- `.reveal` - Fade up from 20px
- `.reveal-left` - Slide from left 40px
- `.reveal-right` - Slide from right 40px
- `.reveal-scale` - Scale from 0.85 to 1
- `.reveal-blur` - Blur in from 8px
- `.reveal-stagger` - Stagger children with `--stagger-i` variable

---

## Animation System

### Three-Layer Animation Architecture

1. **Base Layer** (`animations.css`)
   - Reveal animations (IntersectionObserver)
   - Keyframes (fade-rise, pulse, float, marquee)
   - Stagger system

2. **Effects Layer** (`fx.js`)
   - Stagger reveals
   - Scroll progress bar
   - Magnetic buttons
   - Parallax
   - Card tilt (3D)
   - Mouse glow follower
   - Hero text split
   - Smooth counters
   - Scroll spy

3. **Premium Layer** (`premium-fx.js` + `premium-fx.css`) - **NEW**
   - Spotlight cursor glow
   - Text shimmer
   - Grain overlay
   - Counter pulse
   - Smooth anchor scroll
   - Marquee pause

### Performance Mode

All animations respect performance mode:
- Auto-enabled on low-end devices (≤4GB RAM, <4 CPU cores)
- Respects `prefers-reduced-motion`
- Disables heavy effects (grain, spotlight, shimmer)
- Keeps basic reveals functional

### Premium FX Details

#### Spotlight Effect
```javascript
// Tracks mouse position within cards
card.style.setProperty('--spot-x', `${x}%`);
card.style.setProperty('--spot-y', `${y}%`);
card.style.setProperty('--spot-opacity', '1');
```

Applied to:
- `.glass-card.hoverable`
- `.signal-map`
- `.hero-brand-art`
- `.founder-contact-card`

#### Text Shimmer
```css
.has-shimmer {
  background: linear-gradient(90deg, 
    var(--text-primary) 0%,
    var(--text-primary) 40%,
    var(--accent-cyan) 50%,
    var(--text-primary) 60%,
    var(--text-primary) 100%
  );
  background-size: 250% 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.has-shimmer.shimmer-active {
  background-position: 150% 0;
}
```

#### Grain Overlay
- SVG noise texture
- Fixed position, covers viewport
- Opacity: 0.025 (subtle)
- Mix-blend-mode: overlay

---

## Content Management

### JSON Data Files

All content is stored in `src/data/*.json` files and rendered dynamically.

#### Example: Blog Article Structure
```json
{
  "slug": "telegram-community-management-guide",
  "title": "The Complete Guide to Telegram Community Management",
  "description": "Learn how to build and manage a thriving Telegram community",
  "content": "...",
  "author": "Flexist Team",
  "date": "2026-08-15",
  "tags": ["telegram", "community", "guide"],
  "cluster": "community-management"
}
```

#### Example: Service Structure
```json
{
  "slug": "india-market-entry",
  "title": "India Market Entry",
  "description": "Launch your Web3 project in India",
  "features": [...],
  "pricing": "..."
}
```

### CMS Setup (Decap CMS)

- Admin interface: `public/admin/`
- Config: `public/admin/config.yml`
- Branch: `main`
- Backend: GitHub

**Current CMS Usage:**
- Homepage content
- Services
- Plans
- Experience timeline
- About page
- Global settings

**CMS Limitations:**
- No built-in approval workflow
- No role-based access
- Edits commit directly to main branch
- Triggers immediate deployment

### Blog System

**Current State:**
- 18 blog articles in `src/data/blogArticles.json`
- 4 content clusters:
  1. Community Management
  2. India Market Entry
  3. KOL Marketing
  4. Growth Strategy
- Rendered via `src/pages/resources/blog/[slug].astro`

**Limitations:**
- All articles live immediately (no draft/approval workflow)
- No multi-author support
- No activity logging
- Manual JSON editing required

---

## Deployment Process

### Dual Deployment Setup

1. **Vercel (Primary - Production)**
   - Auto-deploys on push to `main`
   - Serves: `flexist.in`
   - Build: `npm run build`
   - Output: `dist/`
   - Server: Vercel Edge Network

2. **GitHub Pages (Backup)**
   - Auto-deploys via GitHub Actions
   - Serves: `iamamanaga69.github.io` (redirects to flexist.in)
   - Workflow: `.github/workflows/deploy.yml`
   - Same build process

### Deployment Commands

```bash
# Development
npm run dev          # Start dev server (localhost:4321)

# Build
npm run build        # Build to dist/

# Preview
npm run preview      # Preview production build

# Deploy (automatic on push to main)
git push origin main
```

### Environment Variables

```bash
# Vercel
PUBLIC_URL=https://flexist.in

# Cloudflare Worker (payment verification)
WORKER_URL=https://flexist-payment-worker.workers.dev
```

---

## Pending Work

### Admin Panel for Blog Management (admin.flexist.in)

**Status:** Project initialized, dependencies installed

**Requirements:**
1. Secure login system (Admin + Writer roles)
2. Blog post editor (rich text with images, headings, lists)
3. Approval workflow:
   - Writer creates post → saves as draft
   - Writer submits for review
   - Admin reviews → approves or rejects with feedback
   - Approved posts auto-publish to main site
4. User management (admin can add/remove writers)
5. Activity log (who wrote/submitted/approved/rejected)
6. Responsive design (mobile-friendly)

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js (authentication)
- Supabase (database + storage)
- Tiptap (rich text editor)

**Architecture Plan:**

```
flexist-admin/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── posts/route.ts
│   │   ├── posts/[id]/route.ts
│   │   └── publish/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── posts/page.tsx
│   ├── posts/new/page.tsx
│   ├── posts/[id]/edit/page.tsx
│   ├── users/page.tsx (admin only)
│   └── activity/page.tsx
├── components/
│   ├── Editor.tsx (Tiptap)
│   ├── PostList.tsx
│   ├── UserList.tsx
│   └── ActivityLog.tsx
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── types.ts
└── middleware.ts (auth protection)
```

**Database Schema (Supabase):**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'writer')),
  created_at TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'published')),
  feedback TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT,
  post_id UUID REFERENCES posts(id),
  details TEXT,
  created_at TIMESTAMP
);
```

**Auto-Publish Webhook:**
- When admin approves a post → webhook fires
- Webhook updates `src/data/blogArticles.json` in main repo
- Commits to `main` branch → triggers Vercel deploy
- Post goes live within 1-2 minutes

**Next Steps:**
1. Set up Supabase project
2. Configure NextAuth with credentials
3. Build authentication pages (login, signup)
4. Create post editor with Tiptap
5. Implement approval workflow
6. Build admin dashboard
7. Add activity logging
8. Set up webhook for auto-publish
9. Deploy to Vercel at `admin.flexist.in`
10. Configure DNS (CNAME record)

---

## Known Issues & TODOs

### Known Issues

1. **Hero Image Box Shadow (FIXED)**
   - Previously had visible bordered box around hero image
   - Fixed in commits `3bfd9fa`, `42831b9`

2. **Email Update (COMPLETED)**
   - Migrated from `FlexistCrypto@gmail.com` to `owner@flexist.in`
   - Updated across all pages

3. **Typography Scaling (IMPROVED)**
   - Reduced oversized headings
   - Better mobile/desktop balance

### TODOs

#### High Priority

1. **Admin Panel Development**
   - Complete admin panel at `admin.flexist.in`
   - Implement full approval workflow
   - Add user management
   - Set up auto-publish webhook

2. **Blog System Enhancement**
   - Add author bylines to blog posts
   - Implement related posts
   - Add reading time estimate
   - Add social sharing buttons

3. **SEO Improvements**
   - Add structured data (JSON-LD) to blog posts
   - Implement breadcrumbs
   - Add canonical URLs
   - Optimize meta descriptions

#### Medium Priority

4. **Performance Optimization**
   - Lazy load images below the fold
   - Implement image optimization (WebP/AVIF)
   - Add service worker for offline support
   - Optimize font loading

5. **Analytics & Tracking**
   - Set up event tracking for CTAs
   - Track form submissions
   - Monitor animation performance
   - A/B test landing pages

6. **Content Expansion**
   - Write more blog articles (target: 30+)
   - Add case studies
   - Create video content
   - Build resource library

#### Low Priority

7. **Internationalization**
   - Add Hindi language support
   - Translate key pages
   - Localize content for India

8. **Advanced Features**
   - Newsletter signup integration
   - Live chat widget
   - Booking calendar integration
   - Client portal/login

9. **Design Refinements**
   - Add more micro-interactions
   - Implement page transition animations
   - Create loading skeletons
   - Add dark/light theme toggle (already in code, not exposed)

---

## Development Environment

### Prerequisites

- Node.js 20+ (LTS)
- npm or yarn
- Git
- VS Code (recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/iamamanaga69/iamamanaga69.github.io.git flexist.in
cd flexist.in

# Install dependencies
npm install

# Start dev server
npm run dev
```

### VS Code Extensions (Recommended)

- Astro (astro-build.astro-vscode)
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### Code Style

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for JS/TS, double quotes for HTML/JSX
- **Semicolons:** Yes
- **Trailing commas:** Yes (ES5 style)
- **CSS:** BEM-like naming, kebab-case

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature

# After review, merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

### Testing

Currently no automated tests. Manual testing checklist:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile (iOS Safari, Chrome Mobile)
- [ ] Test animations on low-end device
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Test forms (contact, inquiry, payment)
- [ ] Test navigation and routing
- [ ] Test CMS edits via Decap CMS
- [ ] Test deployment preview URLs

### Debugging

#### Animation Issues
- Check browser DevTools → Animations panel
- Verify CSS variables are set correctly
- Check if performance mode is enabled (`document.documentElement.classList.contains('performance-mode')`)

#### Build Issues
```bash
# Clear cache and rebuild
rm -rf dist/
rm -rf node_modules/.cache/
npm run build
```

#### Deployment Issues
- Check Vercel deployment logs
- Verify GitHub Actions workflow status
- Check DNS propagation (if domain issues)

---

## Resources

### Documentation
- [Astro Docs](https://docs.astro.build)
- [Vercel Docs](https://vercel.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Supabase Docs](https://supabase.com/docs)
- [Tiptap Docs](https://tiptap.dev)

### Design Inspiration
- Ventoralabs.io (referenced for premium animations)
- Linear.app (clean UI patterns)
- Vercel.com (excellent developer experience)

### Tools
- **Image Optimization:** TinyPNG, Squoosh
- **SVG Optimization:** SVGO
- **Performance Testing:** Lighthouse, WebPageTest
- **SEO Testing:** Google Search Console, Ahrefs

---

## Contact & Support

**Developer:** Aman  
**Email:** owner@flexist.in  
**GitHub:** iamamanaga69  
**Website:** flexist.in

---

## Changelog

### v2.1.0 (Sept 11, 2026)
- Added premium animation system (spotlight, shimmer, grain)
- Increased hero image size (380px → 480px)
- Added footer logo
- Fixed hero image box styling
- Migrated email to owner@flexist.in

### v2.0.0 (Sept 10, 2026)
- Major typography overhaul
- Reduced heading sizes for better readability
- Improved mobile responsiveness

### v1.9.0 (Sept 5, 2026)
- Rolled back Next.js rewrite (black screen issue)
- Reverted to Astro production build
- Fixed deployment issues

### v1.8.0 (Aug 20, 2026)
- Added India signal map
- Implemented network graph visualization
- Enhanced homepage with new sections

---

**End of Development Guide**

For questions or clarifications, contact owner@flexist.in
