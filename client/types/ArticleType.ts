/** ---------- Subdocument Types ---------- **/

export type CodeLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'bash'
  | 'java'
  | 'other';

export interface CodeBlock {
  _id: string;
  code: string;
  language: CodeLanguage;
  caption?: string;
}

interface ImageAsset{
  alt: string;
  url: string;
}

export type HeadingType = 'h2' | 'h3';

export interface Heading {
  _id: string;
  type: HeadingType;
  text: string;
  essence: string;
  images: ImageAsset[];
  codeBlocks: CodeBlock[];

}

interface Images{
  _id: string;
  alt: string;
  url: string;
}

interface OgMeta {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'video' | 'profile' | string;
}

export interface TwitterMeta {
  title?: string;
  description?: string;
  image?: string;
  cardType?: 'summary' | 'summary_large_image';
}

export interface FAQ {
  question: string;
  answer: string;
}

/** ---------- Main Article Type ---------- **/
export interface ArticleType {
  _id: string;

  title: string;
  slug: string;
  slugHistory?: string[];

  coverImage?: string;
  images: Images[];

  metaDescription: string;
  keywords: string[];
  tags: string[];

  internalLinks: string[];
  externalLinks: string[];

  headings: Heading[];
  codeBlocks: CodeBlock[];

  canonicalUrl?: string;
  structuredData?: Record<string, any>;

  ogMeta?: OgMeta;
  twitterMeta?: TwitterMeta;
  faqSchema?: FAQ[];

  readTime: number;
  author: string;

  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;

  publishedAt?: string | Date;
  lastModifiedAt?: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;

  url?: string; // Virtual: `/articles/${slug}`

/*
  viewportMeta?: string;
  fontSize?: string | number;
*/
}
