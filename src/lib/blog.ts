import blogArticles from '@/data/blogArticles.json';
import { sanityConfigured } from '@/sanity/env';
import { postsQuery, postSlugsQuery, postBySlugQuery } from '@/sanity/queries';

export type BlogPost = {
  slug: string;
  cluster: string;
  title: string;
  description: string;
  service: string;
  intro: string;
  body?: unknown;
  publishedAt?: string;
};

const jsonPosts = Object.values(blogArticles) as BlogPost[];

// Lazy so the Sanity client is only constructed when actually configured.
async function sanityClient() {
  const { client } = await import('@/sanity/client');
  return client;
}

export async function getPosts(): Promise<BlogPost[]> {
  if (!sanityConfigured) return jsonPosts;
  const client = await sanityClient();
  return client.fetch(postsQuery);
}

export async function getPostSlugs(): Promise<string[]> {
  if (!sanityConfigured) return jsonPosts.map((p) => p.slug);
  const client = await sanityClient();
  const rows: { slug: string }[] = await client.fetch(postSlugsQuery);
  return rows.map((r) => r.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityConfigured) return jsonPosts.find((p) => p.slug === slug) ?? null;
  const client = await sanityClient();
  return client.fetch(postBySlugQuery, { slug });
}

export function relatedPosts(posts: BlogPost[], current: BlogPost): BlogPost[] {
  return posts
    .filter((p) => p.cluster === current.cluster && p.slug !== current.slug)
    .slice(0, 3);
}

export function clustersOf(posts: BlogPost[]): string[] {
  return [...new Set(posts.map((p) => p.cluster))];
}
