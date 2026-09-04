/**
 * One-off migration: src/data/blogArticles.json (18 posts) -> Sanity `post` documents.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_WRITE_TOKEN=sk... \
 *   node scripts/migrate-blog-to-sanity.mjs
 *
 * Idempotent: uses createOrReplace with deterministic _id = `post.${slug}`.
 * The write token is read from the environment and NEVER committed.
 */
import { createClient } from '@sanity/client';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const articles = require('../src/data/blogArticles.json');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env. Required: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN (and optionally NEXT_PUBLIC_SANITY_DATASET).'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Portable-text helpers -------------------------------------------------------
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

const bullets = (items) =>
  items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }));

// Body mirrors the old [slug].astro template body so migrated posts read the same.
function buildBody(article) {
  return [
    block('What founders should understand first.', 'h2'),
    block(article.intro),
    block(
      'For Web3 projects, growth does not start when a post goes live. It starts when the user has enough context to trust the project, ask a good question, and take the next step. That is why Flexist connects community, creators, ambassadors, partnerships, and content instead of treating them as separate tasks.'
    ),
    block('How this connects to India growth', 'h2'),
    block(
      'India is a social, community-led market. Users often discover projects through Telegram, YouTube, X, regional communities, and trusted peers. A strong plan turns those discovery points into a clear route: awareness, trust, joining, activation, retention, and advocacy.'
    ),
    block('Founder action checklist', 'h2'),
    ...bullets([
      'Define the exact Indian user you want to reach.',
      'Make sure Telegram or Discord can answer new-user questions quickly.',
      'Choose creators by trust and fit, not only follower count.',
      'Use ambassadors for useful contribution, not noise.',
      'Track community signal weekly so campaigns improve over time.',
    ]),
  ];
}

async function run() {
  const list = Object.values(articles);
  console.log(`Migrating ${list.length} posts to ${projectId}/${dataset}...`);

  // Spread publishedAt into the past so ordering is stable and all are live now.
  const base = Date.now();
  let tx = client.transaction();

  list.forEach((article, i) => {
    keyCounter = 0;
    const publishedAt = new Date(base - i * 86400000).toISOString();
    tx = tx.createOrReplace({
      _id: `post.${article.slug}`,
      _type: 'post',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      cluster: article.cluster,
      description: article.description,
      service: article.service,
      intro: article.intro,
      body: buildBody(article),
      publishedAt,
    });
  });

  const res = await tx.commit();
  console.log(`Done. ${res.results.length} documents written.`);
}

run().catch((err) => {
  console.error('Migration failed:', err.message || err);
  process.exit(1);
});
