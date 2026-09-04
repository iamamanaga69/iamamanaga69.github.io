import global from '@/data/global.json';

// Single source of truth for contact + social links (safe fix: Layout no longer
// hardcodes these; edit src/data/global.json instead).
export const site = {
  email: global.contact_email,
  emailHref: `mailto:${global.contact_email}`,
  telegram: global.telegram_url,
  telegramHandle: global.telegram_handle,
  x: global.x_url,
  linktree: global.linktree_url,
  footerCopy: global.footer_copy,
};

export const socialIcons = {
  telegram: 'M21 4 3 11.2l6.8 2.4L17 8.2l-5.4 6.8.2 5.1 3.1-3.5 4.2 3L21 4Z',
  x: 'm4 4 12.4 16H20L7.6 4H4Zm16 0-7.3 8.2M11.4 15.2 4 20',
  linktree: 'M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5M4 12h16',
  email: 'M4 6h16v12H4V6Zm0 0 8 7 8-7',
};
