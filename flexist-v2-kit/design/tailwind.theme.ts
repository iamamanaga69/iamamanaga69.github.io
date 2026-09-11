// Flexist — Tailwind theme. Maps tokens.css into Tailwind so utilities and CSS
// stay on one source of truth. Drop into tailwind.config.ts.
//
// Deliberately does NOT extend the default palette: if `bg-indigo-500` is still
// reachable, some component will eventually use it. Everything is replaced.

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    // `colors` replaces rather than extends — no default palette escape hatch.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ground: { 0: "var(--ground-0)", 1: "var(--ground-1)", 2: "var(--ground-2)" },
      ink: { 0: "var(--ink-0)", 1: "var(--ink-1)", 2: "var(--ink-2)" },
      line: { 0: "var(--line-0)", 1: "var(--line-1)" },
      accent: { DEFAULT: "var(--accent)", ink: "var(--accent-ink)", wash: "var(--accent-wash)" },
    },
    extend: {
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        display: ["var(--size-display)", { lineHeight: "var(--lh-display)", letterSpacing: "var(--track-display)" }],
        title:   ["var(--size-title)",   { lineHeight: "var(--lh-title)",   letterSpacing: "var(--track-title)" }],
        body:    ["var(--size-body)",    { lineHeight: "var(--lh-body)" }],
        small:   ["var(--size-small)",   { lineHeight: "1.55" }],
        label:   ["var(--size-label)",   { lineHeight: "1", letterSpacing: "var(--track-label)" }],
      },
      borderRadius: { sm: "var(--r-sm)", md: "var(--r-md)", lg: "var(--r-lg)" },
      borderWidth: { DEFAULT: "1px" },       // there is no 2px border on this site
      maxWidth: { container: "var(--container)", measure: "var(--measure)" },
      spacing: { section: "var(--space-section)", gutter: "var(--gutter)", nav: "var(--nav-h)" },
      transitionTimingFunction: { out: "var(--ease)" },
      transitionDuration: { 1: "var(--dur-1)", 2: "var(--dur-2)" },
      // No boxShadow scale on purpose. Elevation is a hairline, not a blur.
    },
  },
  plugins: [],
};

export default config;
