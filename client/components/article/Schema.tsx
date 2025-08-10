import Head from 'next/head';

interface ArticleSchemaProps {
  type: 'Article' | 'BlogPosting';
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image: string;
  publisherName: string;
  publisherLogo: string;
}

export default function Schema(props: ArticleSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": props.type,
    "headline": props.title,
    "description": props.description,
    "author": {
      "@type": "Person",
      "name": props.author
    },
    "datePublished": props.datePublished,
    "dateModified": props.dateModified || props.datePublished,
    "image": props.image,
    "publisher": {
      "@type": "Organization",
      "name": props.publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": props.publisherLogo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": props.url
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}
