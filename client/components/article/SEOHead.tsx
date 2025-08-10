// components/SEOHead.tsx
import Head from 'next/head'

export const SEOHead = ({ title, description, slug }: { title: string; description: string; slug: string }) => {
  return (
    <Head>
      <title>{title} | YourBrandName</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://yourdomain.com/${slug}`} />
    </Head>
  )
}

/*
<SEOHead title={article.title} description={article.metaDescription} slug={article.slug} />


<>
 JSON-LD Auto Inject per Article
 /pages/[slug].tsx or /app/articles/[slug]/page.tsx
  <SEOHead title={article.title} description={article.metaDescription} slug={article.slug} />
  <StructuredData article={article} />
  <main>...</main>
</>

*/
