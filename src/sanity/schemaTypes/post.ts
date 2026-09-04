import { defineField, defineType } from 'sanity';

export const BLOG_CLUSTERS = [
  'Telegram Marketing',
  'India Web3 Market',
  'KOL & Influencer Marketing',
  'Web3 Growth',
  'Ideology',
] as const;

export const SERVICE_SLUGS = [
  'telegram-community-management',
  'web3-marketing-agency-india',
  'kol-influencer-marketing-india',
  'crypto-marketing-agency-india',
  'ambassador-program-management',
  'india-market-entry-services',
  'web3-community-building',
] as const;

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The URL path segment. Must stay stable — /resources/blog/{slug}.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cluster',
      title: 'Cluster',
      type: 'string',
      options: { list: [...BLOG_CLUSTERS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'service',
      title: 'Related service',
      type: 'string',
      description: 'Service page slug this article links to.',
      options: { list: [...SERVICE_SLUGS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      description: 'Lede shown in the hero and opening paragraph.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'A future date schedules the post — it stays hidden until this time.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'cluster', date: 'publishedAt' },
    prepare({ title, subtitle, date }) {
      const when = date ? new Date(date) : null;
      const scheduled = when && when.getTime() > Date.now();
      return {
        title,
        subtitle: `${subtitle}${scheduled ? ` — scheduled ${when!.toLocaleDateString()}` : ''}`,
      };
    },
  },
});
