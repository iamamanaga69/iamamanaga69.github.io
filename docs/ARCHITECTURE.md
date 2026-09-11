# Flexist Platform — Architecture

> **Status:** Draft v1 · **Date:** 2026-09-06 · **Owner:** Flexist
> This document is deliverable #1. It defines the target architecture before any implementation. Companion: [`SCHEMA.md`](./SCHEMA.md) (entity-level data model).

## Locked decisions

These were confirmed at kickoff and shape everything below:

| # | Decision | Choice | Consequence |
|---|----------|--------|-------------|
| 1 | **Tenancy** | **Single-org** (Flexist only) | One `organization` row = Flexist. The enforced isolation boundaries are **per-client** (portal) and **per-role/department** (internal), *not* multi-org. Upgrade path to multi-org preserved (see §7). |
| 2 | **Public site** | **Keep Astro**, add a **separate Next.js backend** sharing the DB | The working public site is *not* rewritten. Its content source moves from `src/data/*.json` → CMS. The OS + client portals are a new Next.js app. |
| 3 | **Foundation** | **Supabase** (Postgres + Auth + Storage) | Auth for both employees and clients; Postgres via Prisma; private Storage buckets for media + documents. |
| 4 | **Team today** | **Solo / 1–3** | Full department/workload model in the schema, but build order front-loads CMS + CRM + client portal; HR/workload UI stays lean until needed. |

**Non-negotiable operating rule (from the 2026-09-05 rollback):** the live domain is never repointed on faith. Every change to the public surface is proven on a Vercel **preview** deployment first. See §14.

## 1. Overview

Flexist is one product understood as five layers over a shared database and authorization model:

1. **Public website** (acquisition) — Astro SSG at `flexist.in`. Fast, SEO-first, content-driven.
2. **CMS** (content control) — structured content types edited in the OS; drives the public site via a publish → rebuild pipeline.
3. **CRM** (sales / client management) — leads → contacts → clients, with lead routing and conversion.
4. **Agency OS** (internal execution) — employees, departments, KOLs, campaigns, deliverables, approvals, community, ambassadors, partnerships, finance, reporting, documents, notifications, automations, audit.
5. **Client portals** (collaboration) — per-client, module-gated views of the client's own work only.

### Guiding principles

- **Content is data, not code.** Anything an admin might reasonably change lives in the CMS, not in components. Layout/structure may be code; business copy, media, links, SEO, nav, footer, banners are CMS-driven.
- **Authorize in the service layer, enforce in the database.** App-layer permission checks are primary; Postgres **Row-Level Security** is defense-in-depth. Never trust a client-supplied id.
- **Every entity has a lifecycle.** Status + audit + soft-delete + preserved ownership are the default, not the happy-path exception (see §9).
- **No fake functionality.** Every action shown as working persists real data. Seed data is labeled and separable from production.
- **Boundaries over convenience.** Public, internal, and client-visible data are separated by design; internal data never leaks to a client because a row happens to exist.

## 2. Current-state reference (what we preserve)

Inspected live at `flexist.in` + repo (`CLAUDE.md`). The business content we carry forward:

- **Positioning:** "India's Web3 Marketing & Community Growth Agency." Founder-led, operator tone. Trust line: *reply within 24h · no retainer to start · founder to founder*.
- **6 core services:** Community Management, India Market Expansion, Influencer & KOL Campaigns, Ambassador Programs, Partnership Operations, Growth Consulting. Each has a "what you get" bullet set.
- **7 SEO service pages** (keyword URLs) + **4 plan tiers** (India Entry / Growth / Partner + Compare) + **18 blog articles** (4 clusters) + **experience/portfolio** (~5–6 projects: Fabwelt, RRG Ventures, Unielon, UXUY, Maestro Bots).
- **Stats:** 5.5+ years, 5+ projects, 10,000+ members, 4 languages.
- **Contact:** FlexistCrypto@gmail.com · t.me/FlexistCrypto · x.com/flexistcrypto · linktr.ee/FlexistWeb3.
- **Private funnel:** `/inquiry` → payment (Cloudflare Worker `flexist-payment-verifier`) → onboarding.

**Technical reality being respected:**
- Astro 4.16.19, `output: 'static'`, npm. Content already lives in `src/data/*.json` (homepage, about, services, seoServices, plans, experience, blogArticles, global) — this is the migration seam into the CMS.
- Decap CMS at `/admin` edits those JSON files today. It is **replaced** by the OS CMS (§10); the JSON files become the initial seed.
- Payment backend is a separate Cloudflare Worker — stays as-is for now; the OS reads its verified-payment records rather than replacing it in Phase 1.

## 3. System architecture

**Monorepo (Turborepo + pnpm)** so the public site and OS share types, the Prisma client, and the content model — without one app's build breaking the other.

```
flexist/
  apps/
    web/          # EXISTING Astro site, moved here verbatim (public flexist.in)
    os/           # NEW Next.js 15 App Router app (Agency OS + CMS admin + client portal + API)
  packages/
    db/           # Prisma schema, generated client, migrations, seed
    core/         # domain logic: services + repositories, permission engine, Zod schemas
    content/      # shared content-type definitions + serializers (CMS ↔ public site)
    config/       # shared tsconfig, eslint, env parsing (Zod-validated process.env)
  docs/
```

**Why a monorepo and not a second repo:** the public site must render CMS content using the *same* content-type definitions the OS writes. Sharing `packages/content` and `packages/db` types kills the drift class of bugs. Astro is moved into `apps/web` unchanged and validated on a Vercel preview before production's root directory is repointed (§14). *(Fallback if the move proves risky: keep Astro at repo root, publish `packages/content` types via a path import; documented as an open decision.)*

**Deployment surfaces (all Vercel projects, one Supabase project):**

| Surface | Host | Renders | Auth |
|---------|------|---------|------|
| `flexist.in` | `apps/web` (Astro SSG) | Published CMS content only | none (public) |
| `app.flexist.in` | `apps/os` (Next.js) | OS + client portal + `/api` | Supabase Auth (required) |
| Preview builds | Vercel preview URLs | Draft content (`apps/web` built with `INCLUDE_DRAFTS=1`) | preview protection |

**Data flow, publish path:** Admin edits content in OS → saved to Postgres as a **draft version** → "Generate preview" builds `apps/web` against drafts on a preview URL → "Publish" flips the version to `published` + fires a Vercel **deploy hook** → `apps/web` rebuilds pulling published content through `packages/content` (build-time read of Postgres, or a read-only content API). The public site stays pure SSG — fast and cacheable — while preview reuses Astro's own rendering so it is pixel-accurate.

## 4. Public-site information architecture

The public site keeps its current routes; each page's business content is sourced from CMS content types instead of hardcoded markup or static JSON.

| Route | Content type(s) driving it | Editable in CMS |
|-------|----------------------------|-----------------|
| `/` (home) | `page:home` (hero, sections), `stat`, `service` (featured), `client_logo`, `testimonial` | headings, copy, CTAs, stats, marquee, logos |
| `/services` + `/services/[slug]` | `service`, `seo_service` | name, slug, descriptions, benefits, process, deliverables, FAQs, media, CTA, SEO, order, related case studies |
| `/plans` + `/plans/[slug]` | `plan`, `plan_feature` | tier name, prices, features, offer schema |
| `/about` | `page:about` (manifesto, mission, vision, values), `team_profile` | all copy + public team |
| `/experience` | `case_study` (public), `project` | portfolio entries, metrics, visibility |
| `/resources/blog` + `/blog/[slug]` | `blog_post`, `category`, `cluster` | full article model, SEO |
| `/contact`, `/inquiry` | `page`, `form` + `form_field` | copy, form fields, lead routing |
| global | `navigation`, `footer`, `announcement_banner`, `site_settings`, `redirect`, `seo_default` | nav, footer route-map, banners, socials, contact, redirects, default SEO |

Structural fixed layout stays in Astro components; **business data is CMS-driven**. `global.json`'s socials/contact — today unused by the layout — become the `site_settings` content type and are actually consumed, ending the drift noted in `CLAUDE.md`.

## 5. Identity, actors & auth

Three actor types, one auth system (Supabase Auth), strict boundaries:

| Actor | Account? | Enters via | Sees |
|-------|----------|-----------|------|
| **Public visitor** | No | `flexist.in` | Published content only. No API access. |
| **Employee** (internal) | Yes | `app.flexist.in` (OS) | Scoped by role + department + assignments (§6–7). |
| **Client user** | Yes | `app.flexist.in/portal` | Only their own client's data, only enabled modules (§7). |

- **One `users` table** keyed to Supabase `auth.users`, carrying `actor_type` (`employee` | `client`). An employee profile (`employees`) or a client-user link (`client_users`) hangs off it. Never a shared login that is "sometimes internal, sometimes client."
- **Sessions:** Supabase JWT; server components/route handlers read the session server-side. Portal and OS are the same app but different route trees with different guards; a client JWT can never resolve an OS route and vice-versa.
- **No internal API is reachable unauthenticated.** `/api/*` requires a session and passes through the permission engine. The public site calls *no* runtime API — it is built content.
- **Onboarding/offboarding:** creating an employee provisions an auth user + role assignment; deactivation triggers the **reassignment gate** (§9) before access is revoked. Client users are invited per client and scoped at creation.

## 6. Authorization model

Authorization is **RBAC + department scope + assignment scope + client-module gating**, resolved by a single permission engine in `packages/core` and enforced again by Postgres RLS.

**Primitives:**
- **Permission** = `resource:action` (e.g. `campaign:approve`, `invoice:read`, `cms.page:publish`). Actions include `read | create | update | delete | publish | approve | assign | export`. A permission can be qualified **`own` | `department` | `client` | `all`** to bound its scope.
- **Role** = a named bundle of permissions (`admin`, `manager`, `account_manager`, `kol_ops`, `community_lead`, `finance`, `content_editor`, `analyst`, `member`, `client_viewer`, `client_approver`). Roles are data, editable in Settings — not hardcoded enums.
- **Department** = org unit (`sales_crm`, `account_management`, `project_management`, `kol_ops`, `community`, `partnerships`, `content_creative`, `finance`, `analytics`, `people_ops`, `marketing`, `admin`). An employee may belong to several, with one primary.
- **Assignment** = the row that says employee X works on client/campaign/deliverable/lead Y. `own`-scoped permissions resolve through assignments.

**Effective access = role permissions ∩ scope**, where scope is the widest of: `all` (org admins) → `department` (managers over their dept's work) → `client`/`own` (assigned ICs). A manager sees their department's workload and performance but **not** unrelated confidential data (e.g. finance) unless granted.

**Permission matrix (illustrative, not exhaustive — full set seeded in `packages/core`):**

| Resource | admin | manager (dept) | account_mgr | kol_ops | finance | content_editor | client_approver |
|----------|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| CMS pages/services | publish | — | — | — | — | edit (draft) | — |
| Leads | all | dept | own+assigned | — | — | — | — |
| Clients | all | dept | assigned | assigned (read) | read (billing) | — | own client |
| KOL database | all | dept | read | manage | read (rates) | — | — |
| Campaigns | all | dept | assigned | assigned | read | — | own (read) |
| Deliverables | all | dept | assigned | assigned | — | — | approve own |
| Invoices/Payments | all | read | read own client | — | manage | — | own (read/pay) |
| Reports | all | dept | assigned | assigned | financial | — | own (published) |
| Employees/Depts | all | own dept (read) | — | — | — | — | — |
| Audit logs | all | — | — | — | — | — | — |

**Client module gating.** Each client has a `client_modules` set. Enabled modules can be toggled `disabled | internal_only | read_only | client_visible`. The client portal's navigation and pages are generated from this set — a module that is `internal_only` never renders in the portal, `read_only` renders without mutations. Admins change a client's modules with no code change. Modules: `kol`, `community`, `ambassadors`, `partnerships`, `market_expansion`, `social`, `content`, `consulting`, `reporting`, `documents`, `approvals`, `billing`.

## 7. Client isolation & multi-org upgrade path

**The boundary that is tested like a security control (per the brief's "Org A cannot see Org B"):** in single-org mode this is **client isolation** — *Client A's user cannot reach Client B's data by changing a URL, id, query param, or API body.*

Defense-in-depth, three layers:
1. **Route/UI:** portal routes are always scoped `/portal/...` and resolve the client from the session's `client_users` link — never from a URL id.
2. **Service layer:** every repository read/write for client-scoped resources requires a `clientId` derived from the session; ids in the request are validated to belong to that client or rejected (`404`, not `403`, to avoid enumeration).
3. **Database RLS:** client-scoped tables carry `client_id`; policies restrict `client` actors to rows where `client_id` ∈ their linked clients. Employees are gated by department/assignment policies. RLS is the backstop if app code has a bug.

**Multi-org upgrade path (not built now, but not blocked):** a single `organization` row exists and is referenced by top-level entities. To become multi-org later: stop hardcoding the Flexist org id, add `organization_id` scoping to RLS predicates (client tables already sit under a client which sits under the org), and scope auth to org membership. No entity redesign required — this is why we model `organization` as a real table today rather than assuming it away.

## 8. Data model (overview)

Full entity/field/relationship detail is in [`SCHEMA.md`](./SCHEMA.md). Grouped by domain:

- **Identity & org:** `organization`, `users`, `employees`, `departments`, `teams`, `memberships`, `roles`, `permissions`, `role_permissions`, `reporting_relationships`.
- **Work & accountability:** `assignments`, `workload_records`, `availability`, `tasks`, `approvals`.
- **CRM:** `leads`, `contacts`, `clients`, `client_users`, `client_modules`.
- **Services & delivery:** `services`, `campaigns`, `campaign_templates`, `campaign_members`, `deliverables`, `deliverable_versions`.
- **KOL:** `kols`, `kol_platforms`, `kol_rates`, `kol_relationships`, `kol_performance`.
- **Community & growth:** `communities`, `community_metrics`, `ambassadors`, `ambassador_tasks`, `ambassador_rewards`, `partnerships`.
- **Finance:** `invoices`, `payments`, `expenses`.
- **Reporting & docs:** `reports`, `report_metrics`, `documents`, `document_versions`.
- **CMS:** `website_pages`, `website_sections`, `content_versions`, `navigation_items`, `case_studies`, `testimonials`, `team_profiles`, `faqs`, `blog_posts`, `categories`, `media_assets`, `redirects`, `seo_metadata`, `site_settings`, `announcement_banners`.
- **Forms & routing:** `forms`, `form_fields`, `form_submissions`, `lead_routing_rules`.
- **Platform:** `notifications`, `automation_rules`, `activity_logs`, `audit_logs`, `settings`, `integrations`.

**Modeling rules:** global entities (KOLs, partners) are **not duplicated per client** — they live once and relate to clients/campaigns through join tables (`kol_relationships`, `campaign_members`). Money is stored as integer minor units + currency. Timestamps are UTC. Soft-deletes via `deleted_at`. Every mutable business entity carries `status`, `created_by`, `updated_by`, and audit coverage.

## 9. Lifecycle & state conventions (the "not just happy-path" discipline)

Every business entity declares its states and what each transition does to related data. Reusable conventions applied everywhere:

- **Status is explicit.** e.g. content `draft → in_review → published → archived`; deliverables `todo → in_progress → submitted → in_review → approved | rejected → delivered`; leads `new → qualified → proposal → won | lost`; invoices `draft → sent → partially_paid → paid | overdue | void`.
- **Create/edit/duplicate:** duplicating copies content but resets status to `draft`, ownership to the actor, and clears external ids (invoice numbers, published slugs).
- **Review/approve/reject:** approvals record actor + timestamp + note; rejection returns the item to an editable state and notifies the owner; approval is immutable history.
- **Publish/unpublish/archive:** publish snapshots a version (§10); unpublish never deletes history; archive hides from lists but preserves references.
- **Delete:** soft-delete by default; hard-delete is admin-only, blocked when references exist, and always audited. Destructive actions require confirmation and are logged with before/after.
- **Reassign:** ownership changes preserve the prior owner in history; `own`-scoped access follows the new assignment.
- **Cross-boundary access:** a request for an object the actor's role/department/client can't reach returns `404` (not `403`) and is logged.
- **Offboarding gate:** deactivating an employee is blocked until active leads, campaigns, tasks, approvals, and client relationships are reassigned; historical ownership and audit rows are retained forever.

## 10. CMS model

**Structured content, not a freeform page builder.** Reliability and design consistency beat drag-and-drop. Content types have typed fields (validated by Zod in `packages/content`), so the Astro templates always receive a known shape.

- **Content types** map to the IA in §4: `page` (with typed `sections`), `service`, `seo_service`, `plan`/`plan_feature`, `blog_post`/`category`, `case_study`, `testimonial`, `team_profile`, `faq`, `navigation`, `footer`, `site_settings`, `announcement_banner`, `seo_metadata`, `redirect`, `media_asset`, `form`/`form_field`.
- **Draft & published versions.** Each editable record has a working draft and a published snapshot. Editing touches the draft only; the public site reads published. `content_versions` stores immutable snapshots: `{who, when, diff, full_payload}`.
- **Revision history & restore.** Every publish writes a version; an admin can diff versions, see who changed what and when, and restore a prior version (which becomes a new draft to re-publish).
- **Preview workflow.** "Generate preview" builds `apps/web` with `INCLUDE_DRAFTS=1` to a Vercel preview URL — pixel-accurate because it uses the real Astro templates. Nothing is public until "Publish."
- **Publish pipeline.** Publish → flip version to `published` + write audit + fire Vercel deploy hook → `apps/web` rebuilds. SSG stays fast; no runtime DB dependency on the public site.
- **Media library.** `media_assets` in Supabase Storage (public bucket for site media, private bucket for client documents). Uploads capture alt text, dimensions, and usage back-references so an admin sees where an asset is used before deleting it.
- **Seeding.** Existing `src/data/*.json` is imported once to seed content types — no copy is lost in the migration. Decap `/admin` is retired after parity is verified.

## 11. Route structure

**Public (`apps/web`, Astro)** — unchanged routes, now CMS-fed: `/`, `/about`, `/contact`, `/experience`, `/flexistlabs`, `/services`, `/services/[slug]`, `/plans` (+ `/plans/[slug]`), `/resources` (+ `/blog`, `/blog/[slug]`, `/guides`, `/case-studies`), `/inquiry`. Payment/onboarding funnel stays (Cloudflare Worker) until Phase 6.

**OS (`apps/os`, Next.js App Router):**
```
/(auth)/login, /accept-invite, /reset
/(os)/dashboard                         role-specific home
/(os)/cms/{pages,services,plans,blog,case-studies,team,media,nav,settings,seo}
/(os)/crm/{leads,contacts,clients}
/(os)/clients/[clientId]/{overview,modules,campaigns,deliverables,documents,billing,team}
/(os)/kol/{database,rates,relationships,performance}
/(os)/campaigns/[id]/{brief,members,deliverables,approvals,report}
/(os)/community, /ambassadors, /partnerships
/(os)/finance/{invoices,payments,expenses}
/(os)/reports, /documents, /tasks
/(os)/people/{employees,departments,teams,workload,roles}   # lean UI in Phase 1
/(os)/settings/{org,roles,integrations,automations,audit}
/(portal)/portal/{dashboard, [module]...}   # client-facing, module-gated
/api/*                                        # authenticated; permission-checked
```
Route groups carry guards: `(os)` requires an employee session; `(portal)` requires a client session resolved to a client; `(auth)` is unauthenticated.

## 12. Component & code architecture

- **UI:** Tailwind + **shadcn/ui** (accessible primitives), a Flexist theme layer matching the existing dark-neon design tokens so the OS feels on-brand. Server Components by default; Client Components only where interactivity requires.
- **Service/repository layer (`packages/core`):** repositories own data access (Prisma) and enforce scope; services own business logic and orchestrate repositories + audit + notifications. **API routes and UI never call Prisma directly** — they call services. This is what keeps logic un-duplicated and testable.
- **Validation:** Zod schemas are the single source of truth for input shapes, shared by forms, API handlers, and content types. No unvalidated input reaches a repository.
- **Permission engine:** one `can(actor, permission, resource?)` used by UI (to hide/disable), API (to authorize), and reflected in RLS. UI hiding is UX only — the API and DB are the real gates.
- **Errors & auditing:** a mutation wrapper writes `activity_logs`/`audit_logs` transactionally with the change, so history can't drift from data.

## 13. Security

- **AuthN:** Supabase Auth; server-side session verification on every OS/API request. Invite-only for employees and client users; no public signup.
- **AuthZ:** service-layer `can()` + Postgres RLS on all client-/department-scoped tables. Deny by default.
- **Isolation:** ids from requests are never trusted; scope is derived from the session. Cross-boundary reads return `404` and are logged.
- **Secrets:** in Vercel/Supabase env, Zod-validated at boot (`packages/config`); never in the repo. Service-role keys live only in server contexts, never shipped to the browser or the public site.
- **Storage:** client documents in a private bucket served via short-lived signed URLs; access checked by the same permission engine.
- **Public surface:** static, no DB/API at runtime — minimal attack surface. Forms post to authenticated OS endpoints with spam/rate protection.
- **Audit:** privileged and destructive actions are immutable-logged with actor, target, before/after, and timestamp.

## 14. Environments, deploy & rollback

Directly answers the 2026-09-05 rollback.

- **Environments:** `local` (Supabase local or a dev project) → `preview` (per-PR Vercel) → `production`.
- **The public site is never migrated in place.** `apps/web` is validated on a Vercel preview (identical build to today's) *before* production's root directory is repointed to `apps/web`. If anything regresses, production still points at the current working build.
- **OS ships behind auth** at `app.flexist.in` from day one, so it can go live incrementally without touching `flexist.in`.
- **DB migrations** are Prisma-managed, reviewed, and run forward-only in production; every migration is reversible in staging first.
- **Rollback:** public content publish → deploy hook; a bad publish is reverted by restoring the prior `content_version` and re-triggering the build (no code deploy needed). A bad code deploy is an instant Vercel rollback to the prior deployment.
- **Feature flags / module toggles** let unfinished modules stay dark in production while the schema and partial UI exist.

## 15. Testing strategy (mandatory)

- **Unit:** permission engine (`can()` across role × scope × resource), Zod schemas, money/lifecycle transition functions.
- **Integration (against a test Postgres):** repository scope enforcement, RLS policies, CMS draft/publish/version/restore, form submission → lead → conversion, deliverable submit → approve/reject, workload reassignment, offboarding gate.
- **Isolation/security (the headline suite):** Client A **cannot** read/write Client B via changed URL, id, query param, or API body (expects `404` + audit); a client JWT cannot resolve OS routes/APIs; an employee cannot read another department's confidential data; finance-only actions rejected for non-finance; unauthenticated `/api/*` rejected.
- **E2E (Playwright):** login (employee + client), CMS publish → public reflects it, portal shows only enabled modules, approval flow end-to-end, destructive-action confirmation.
- **Seed vs prod:** seed data is flagged (`is_seed`) and never mixed into production assertions.

<!-- APPEND -->






