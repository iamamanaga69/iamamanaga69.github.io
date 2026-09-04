import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono, Bricolage_Grotesque, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '../styles/global.css';
import '../styles/components.css';
import '../styles/animations.css';
import '../styles/pages.css';
import '../styles/mobile-fixes.css';
import '../styles/fonts.css';

import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--nf-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--nf-jetbrains', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--nf-bricolage', display: 'swap' });
const syne = Syne({ subsets: ['latin'], weight: ['600', '700'], variable: '--nf-syne', display: 'swap' });

const fontVars = `${inter.variable} ${jetbrains.variable} ${bricolage.variable} ${syne.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://flexist.in'),
  icons: { icon: '/assets/images/flexist-avatar-192.png' },
};

// No-flash theme: applied before paint so a light-mode reload never flashes dark.
const themeScript = `(function(){try{var p=new URLSearchParams(location.search).get('theme');var s=p||localStorage.getItem('flexist-theme');if(!s){s=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(s==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
        <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
        <SiteNav />
        {children}
        <SiteFooter />
        <Script src="/scripts/global.js" strategy="afterInteractive" />
        <Script src="/scripts/fx.js" strategy="afterInteractive" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
