import { buildMetadata } from '@/lib/seo';
import { getPosts, clustersOf } from '@/lib/blog';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'Web3 Marketing Blog India | Flexist',
  description: 'Read Flexist guides on Telegram marketing, India Web3 market entry, crypto KOL campaigns, ambassador programs, and Web3 community growth.',
  canonical: 'https://flexist.in/resources/blog',
});

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const clusters = clustersOf(posts);

  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="page-kicker">Blog</p>
          <h1 className="page-title">Web3 Marketing Blog<br /><span className="gradient-text">for Founders</span></h1>
          <p className="page-lede">Practical India growth articles for Web3 founders who want useful users, trusted communities, and better campaign sequencing.</p>
        </div>
      </section>
      {clusters.map((cluster) => (
        <section className="section" key={cluster}>
          <div className="container">
            <div className="section-header reveal">
              <span className="section-label">{cluster}</span>
              <h2 className="section-title">{cluster}</h2>
            </div>
            <div className="grid-3">
              {posts.filter((article) => article.cluster === cluster).map((article) => (
                <article className="glass-card hoverable reveal" key={article.slug}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={`/resources/blog/${article.slug}`}>Read Article &rarr;</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
