/** ---------- Subdocument Types ---------- **/

export type CodeLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'bash'
  | 'other';

export interface CodeBlock {
  _id: string;
  code: string;
  language: CodeLanguage;
  caption?: string;
}

export type HeadingType = 'H2' | 'H3';

export interface Heading {
  _id: string;
  type: HeadingType;
  text: string;
}

export interface OgMeta {
  title?: string;
  description?: string;
  image?: string;
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

  content: string;
  coverImage?: string;

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
}
