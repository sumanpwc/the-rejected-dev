import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug } from '@/lib/api';
import { ArticleType } from '@/types/ArticleType';
import TableOfContents from '@/components/TableOfContents';
import StructuredRenderer from '@/components/StructuredRenderer';

type Props = { params: { slug: string } };

// ----------- SEO Metadata -----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} | TheRejected`,
    description: article.metaDescription,
    keywords: article.tags.join(', '),
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://therejected.dev/articles/${article.slug}`,
      type: 'article',
      images: article.coverImage ? [{ url: article.coverImage, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

// ----------- JSON-LD Structured Data -----------
function ArticleStructuredData(article: ArticleType) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: article.coverImage,
    author: { '@type': 'Person', name: article.author },
    datePublished: article.createdAt,
    keywords: article.tags.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ----------- Header -----------
function ArticleHeader({
  title,
  author,
  createdAt,
  coverImage,
}: Pick<ArticleType, 'title' | 'author' | 'createdAt' | 'coverImage'>) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
        {title}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        By <strong>{author}</strong> • {formattedDate}
      </p>
      {coverImage && (
        <figure className="relative w-full h-72 md:h-[30rem] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={coverImage}
            alt={`Cover for ${title}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </figure>
      )}
    </header>
  );
}

// ----------- Outline -----------
function ArticleOutline({ headings }: { headings: ArticleType['headings'] }) {
  if (!headings?.length) return null;
  return (
    <nav className="mt-10 mb-12" aria-label="Article Outline">
      <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Quick Navigation</h2>
      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
        {headings.map(h => (
          <li key={h._id}>
            <a
              href={`#${h.text.replace(/\s+/g, '-').toLowerCase()}`}
              className="hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ----------- Tags -----------
function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
      {tags.map(tag => (
        <span
          key={tag}
          className="bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

// ----------- Related Links -----------
function RelatedLinks({
  internalLinks,
  externalLinks,
}: {
  internalLinks: string[];
  externalLinks: string[];
}) {
  if (!internalLinks.length && !externalLinks.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!!internalLinks.length && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-600">Internal</h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
              {internalLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link} className="hover:underline text-blue-600 dark:text-blue-400">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!externalLinks.length && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-600">External</h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
              {externalLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// ----------- Author Bio -----------
function AuthorBio({ author }: { author: string }) {
  return (
    <section className="mt-20 pt-10 border-t border-slate-300 dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-3">About the Author</h2>
      <p className="text-slate-700 dark:text-slate-300">
        {author} is a tech enthusiast and engineer passionate about scalable systems, Java, and real-world architectures.
        Stay connected with {author} for insightful technical articles.
      </p>
    </section>
  );
}

// ----------- Main Page -----------
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

  return (
      <article className="max-w-7xl mx-auto px-4 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
        {/* TOC Column */}
        <aside className="hidden lg:block">
          <TableOfContents headings={article.headings} />
        </aside>

        {/* Main Content Column */}
        <div>
          {/* Structured Data */}
          <ArticleStructuredData {...article} />

          <ArticleHeader
            title={article.title}
            author={article.author}
            createdAt={article.createdAt}
            coverImage={article.coverImage}
          />

          <ArticleOutline headings={article.headings} />

          <section
            className="prose prose-slate dark:prose-invert prose-lg max-w-none"
            itemProp="articleBody"
          >
            <StructuredRenderer article={article} />
          </section>
          
          <TagList tags={article.tags} />
          <RelatedLinks internalLinks={article.internalLinks} externalLinks={article.externalLinks} />
          <AuthorBio author={article.author} />
        </div>
      </article>

  );
}
