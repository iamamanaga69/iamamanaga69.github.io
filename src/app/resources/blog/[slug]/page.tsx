import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { PostBody } from '@/components/PostBody';
import { getPosts, getPostSlugs, getPostBySlug, relatedPosts } from '@/lib/blog';

export const revalidate = 60;
export const dynamicParams = true; // scheduled posts resolve on first request

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getPostBySlug(params.slug);
  if (!article) return {};
  return buildMetadata({
    title: `${article.title} | Flexist`,
    description: article.description,
    canonical: `https://flexist.in/resources/blog/${article.slug}`,
  });
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = await getPostBySlug(params.slug);
  if (!article) notFound();

  const all = await getPosts();
  const related = relatedPosts(all, article);
  const canonical = `https://flexist.in/resources/blog/${article.slug}`;
  const hasBody = Array.isArray(article.body) && article.body.length > 0;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: 'Flexist' },
    publisher: {
      '@type': 'Organization',
      name: 'Flexist',
      logo: { '@type': 'ImageObject', url: 'https://flexist.in/assets/images/flexist-avatar-192.png' },
    },
    mainEntityOfPage: canonical,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
  };

  return (
    <>
      <JsonLd schema={articleSchema} />
      <main id="main-content">
        <article>
          <section className="page-hero">
            <div className="container page-hero-content">
              <p className="page-kicker">{article.cluster}</p>
              <h1 className="page-title">{article.title}</h1>
              <p className="page-lede">{article.intro}</p>
              <div className="button-row">
                <a className="neon-button" href={`/services/${article.service}`}>Relevant Service</a>
                <a className="ghost-button" href="/inquiry">Ask Flexist</a>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container split-layout">
              <div className="manifesto-copy reveal">
                {hasBody ? (
                  <PostBody value={article.body} />
                ) : (
                  <>
                    <h2 className="section-title">What founders should understand first.</h2>
                    <p>{article.intro}</p>
                    <p>For Web3 projects, growth does not start when a post goes live. It starts when the user has enough context to trust the project, ask a good question, and take the next step. That is why Flexist connects community, creators, ambassadors, partnerships, and content instead of treating them as separate tasks.</p>
                    <h2>How this connects to India growth</h2>
                    <p>India is a social, community-led market. Users often discover projects through Telegram, YouTube, X, regional communities, and trusted peers. A strong plan turns those discovery points into a clear route: awareness, trust, joining, activation, retention, and advocacy.</p>
                    <h2>Founder action checklist</h2>
                    <ul className="value-list">
                      <li>Define the exact Indian user you want to reach.</li>
                      <li>Make sure Telegram or Discord can answer new-user questions quickly.</li>
                      <li>Choose creators by trust and fit, not only follower count.</li>
                      <li>Use ambassadors for useful contribution, not noise.</li>
                      <li>Track community signal weekly so campaigns improve over time.</li>
                    </ul>
                  </>
                )}
              </div>
              <aside className="glass-card reveal">
                <span className="section-label">Related Reading</span>
                <ul className="value-list">
                  {related.map((item) => <li key={item.slug}><a href={`/resources/blog/${item.slug}`}>{item.title}</a></li>)}
                </ul>
                <a className="ghost-button" href="/resources/blog">All Blog Articles</a>
              </aside>
            </div>
          </section>

          <section className="section section-dark">
            <div className="container">
              <div className="cta-block reveal">
                <h2>Want this applied to your project?</h2>
                <p>Share your category, stage, current community, and India goal. Flexist will help map the next move.</p>
                <div className="button-row">
                  <a className="neon-button" href="/inquiry">Open Founder Inquiry</a>
                  <a className="ghost-button" href={`/services/${article.service}`}>View Related Service</a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
