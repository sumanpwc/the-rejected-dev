// components/StructuredData.tsx


export const StructuredData = ({ article }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    author: {
      "@type": "Person",
      name: article.author?.name || 'Suman Das',
      url: article.author?.profileUrl,
    },
    image: article.coverImageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: `https://yourdomain.com/${article.slug}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/*
Inject <script type="application/ld+json"> into <Head>
<StructuredData article={article} />

*/