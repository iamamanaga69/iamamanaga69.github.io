import type { Config } from 'tailwindcss';

// Tailwind is available for NEW work. The ported design system lives in
// src/styles/*.css (CSS custom properties), so tokens are exposed here as
// var()-backed aliases rather than duplicated hex values.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-blue': 'var(--accent-blue)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-purple': 'var(--accent-purple)',
        'accent-green': 'var(--accent-green)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
        accent: 'var(--font-accent)',
      },
    },
  },
  plugins: [],
};

export default config;
