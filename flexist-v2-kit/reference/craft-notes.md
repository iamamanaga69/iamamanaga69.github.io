# Reference read — what to take, what to beat

Eight sites were named as inspiration. Five returned content and were read
directly (0x.agency, neolune.xyz, crynet.io, kitaagency.com, barkmedia.xyz).
jukebox3.io and markchain.io were not reachable for analysis; iumlabs.io was
blocked. Everything below comes from the five that were actually read — nothing
here is guessed.

What the extractions gave: structure, section order, exact copy, asset naming,
platform, and heading hierarchy. What they did **not** give: stylesheets. So no
hex values or font stacks are quoted from these sites, because they weren't
observable. Do not let anyone "match their palette" — nobody knows it.

---

## Take this

**Numbered structure carries a page without decoration.** 0x runs `01`–`05` and
`01`–`04` lists; crynet styles its numerals as `-1-` through `-4-`. This is the
cheapest way to make a section feel authored. Use `01 / 02 / 03` in mono.

**One consistent typographic device, repeated.** kitaagency splits every heading
into bold + regular ("**Grow Your Community** With KITA", "What We Can Do **For
You**"). 0x splits its H1 into three coloured segments and reuses that split on
every CTA heading. Pick exactly one such device and use it everywhere.

**A glyph convention that means something.** neolune uses `↗` for "go read more"
and `→` for "convert now", consistently. Two arrows, two jobs, never mixed.

**The case-study template is the best thing on any of these sites.** neolune
repeats one shape three times: brand name + "Case Study", two KPI pairs, a
hairline rule, a narrative paragraph, a "Services" label, a rule, the services
list, "Read Case Study ↗", then a full-bleed cover. Steal this shape exactly.

**Anchor proof to something external.** crynet attaches every claim to Clutch,
GoodFirms, The Manifest, ICOHolder — and its FAQ includes an explicit
non-guarantee. A verifiable small number beats an unverifiable big one.

**Real embedded work instead of a logo wall.** kitaagency's portfolio is ten
actual X and Instagram posts, linked. For Flexist that translates directly:
link the live Telegram and X channels. It cannot be faked, which is the point.

**Restraint as a whole strategy.** barkmedia is one line — "The most influential
Web3 marketing firm." — one CTA, and everything else inside a two-step modal
with three budget brackets (30–50k / 50k–100k / 100k+). The least content of
the five and the most confident. This is the closest reference to the target.

**Authored empty and loading states.** 0x ships real strings: "Loading
network…", "No live events at the moment", "No spaces found in this date range".
Almost nobody writes these. Write them.

---

## Beat this — every defect found, and the rule it produces

Five sites, and every one of them has shipped avoidable damage. This is the
actual opportunity: not out-designing them, out-finishing them.

| Site | Defect found | Rule for this build |
|---|---|---|
| 0x.agency | Footer carries **both** a 2025 and a 2026 copyright line | Footer year is `new Date().getFullYear()`. Never a literal. |
| kitaagency | Footer says 2026 over July 2025 content | Same rule. One source for the year. |
| neolune | Footer copyright still 2024 | Same rule. Three of five sites got this wrong. |
| neolune | Nav reads "Case **Sudies**"; "**Soecial** Media Management" twice | Ship a spell-check pass over CMS output. Read the nav out loud. |
| kitaagency | Two blog permalinks are unreplaced lorem-ipsum slugs | Slugs auto-generate from the title and are validated unique. |
| kitaagency | 14 client logos use the raw destination URL as alt text | Alt text is a **required** CMS field with a min length. |
| kitaagency | Blog card `h2`s nest under section `h3`s — inverted outline | One `h1`; headings descend in order. Assert it in a test. |
| kitaagency | Anchor is `#portofolio` while the label says "Portfolio" | Slugs come from data, never hand-typed twice. |
| kitaagency | A second CTA with no text label, and a duplicated nav list for mobile | One nav list, restyled. Every link has an accessible name. |
| neolune | Three "Cost Per Click Calculator" cards are identical placeholders with dead links | Nothing ships in a stub state. Cut the section instead. |
| neolune | All four footer tool links resolve to the same Google Calendar URL | Every link goes somewhere distinct or is removed. |
| neolune | The "why us" comparison is a **baked PNG**, desktop and mobile variants | No text inside an image, ever. Build it in HTML. |
| neolune | "Unlock the power of…", "Ready to take your brand to the moon? 🌕" | Banned copy list. No emoji. |
| neolune | Purple / blue / red persona cards on an otherwise monochrome page | One accent, one hue. |
| neolune | Typedream theme tokens — the design system is the platform's | Own the tokens. That is what makes it look bespoke. |
| crynet | The four-step process is prose with inline numerals, not a list | Every visual list is a real `<ol>` / `<ul>`. |
| crynet | 9 of 10 service cards link; one is plain text | Uniform affordances. A grid where one card is dead reads as broken. |
| crynet | Icons mixed from two sources — inconsistent stroke weights | One icon source, or none. Prefer none. |
| barkmedia | Wordmark ships as `Layer_1 (1).svg` — unrenamed Illustrator export | Assets are named for what they are. |
| barkmedia | Stock SVGRepo close glyph; Webflow's default form success/error strings | Write your own success and error copy. |
| barkmedia | Primary CTA is `href="#"` | No `#` hrefs. A button that opens a dialog is a `<button>`. |
| barkmedia | Both form panes render simultaneously, toggled by visibility | Step 2 is not in the DOM until step 1 validates. |
| 0x.agency | 27 client logos repeated three times to fake a marquee | If there are five clients, show five names. |
| 0x.agency | ~20 sections on the home page | Seven, maximum. |
| 0x.agency | "$500M+", "200+ projects", "10M+" — nothing checkable | Only the three real numbers, each attached to a named project. |

## The gap to actually exploit

All five lead with scale they cannot prove. Flexist cannot win that contest and
should not enter it: 5+ projects and 10,000+ members against "$500M+ raised"
is a losing frame.

Change the frame. Every number on this site is attached to a named project, a
year, a role, and where possible a public channel a founder can open in a new
tab. `Unielon Wallet · 2022–2023 · Community & Social Lead · 10,000+ real
members, zero bots.` None of the five references has a single line that
specific, because specificity is only available to people who did the work.

Second gap: none of them is editable. Two are on Tilda and Typedream, one on
WordPress, one on Webflow, one on Vite — and every one shows stale years,
placeholder cards, and typos, which is what happens when updating the site is
someone's chore. Flexist ships with every string in a CMS and a publish that is
live in seconds. That is a durability advantage, and it is why the copyright
year is computed rather than typed.
