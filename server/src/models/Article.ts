// server/models/Article.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';

/** ---------- Subdocument Interfaces ---------- **/
interface CodeBlock {
  code: string;
  language: string;
  caption?: string;
}

interface ImageAsset{
  alt: string;
  url: string;
}

interface Heading {
  type: 'h2' | 'h3';
  text: string;
  essence: string;
  images?: ImageAsset[];
  codeBlocks: CodeBlock[];
}

interface OgMeta {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'video' | 'profile' | string;
}

interface TwitterMeta {
  title?: string;
  description?: string;
  image?: string;
  cardType?: 'summary' | 'summary_large_image';
}

interface FAQ {
  question: string;
  answer: string;
}

/** ---------- Main Article Interface ---------- **/
export interface IArticle extends Document {
  title: string;
  slug: string;
  slugHistory?: string[];

  metaDescription: string;
  keywords: string[];
  tags: string[];

  headings: Heading[];
  coverImage?: string;
  author: string;
  internalLinks: string[];
  externalLinks: string[];

  canonicalUrl?: string;
  structuredData?: Record<string, any>;
  ogMeta?: OgMeta;
  twitterMeta?: TwitterMeta;
  faqSchema?: FAQ[];

  readTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;

  publishedAt?: Date;
  lastModifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  url?: string; // virtual for frontend routing
}

/** ---------- Schema Definition ---------- **/
const ArticleSchema: Schema<IArticle> = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    slugHistory: {
      type: [String],
      default: [],
    },
    metaDescription: {
      type: String,
      required: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    headings: [
      {
        type: {
          type: String,
          enum: ['h2', 'h3'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        essence: {
          type: String,
          required: true,
        },
        images: {
          type: [{ alt: String, url: String }],
          default: [],
        },
        codeBlocks: [
          {
            code: { type: String, required: true },
            language: { type: String, required: true },
            caption: { type: String },
          },
        ],
        
      },
    ],

    coverImage: {
      type: String,
    },
    
    author: {
      type: String,
      required: true,
      trim: true,
    },
    internalLinks: {
      type: [String],
      default: [],
    },
    externalLinks: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
    },
    structuredData: {
      type: Schema.Types.Mixed,
    },
    ogMeta: {
      title: String,
      description: String,
      image: String,
      type: {
        type: String,
        enum: ['website' , 'article' , 'video' , 'profile'],
      },
    },
    twitterMeta: {
      title: String,
      description: String,
      image: String,
      cardType: {
        type: String,
        enum: ['summary', 'summary_large_image'],
      },
    },
    faqSchema: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    readTime: {
      type: Number,
      required: true,
      min: 1,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    lastModifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/** ---------- Indexes for Efficient Search ---------- **/
ArticleSchema.index({ title: 'text', tags: 'text', keywords: 'text' });

/** ---------- Virtuals ---------- **/
ArticleSchema.virtual('url').get(function (this: IArticle) {
  return `/articles/${this.slug}`;
});

/** ---------- Middleware ---------- **/

// Auto-generate slug if missing and add to history on change
ArticleSchema.pre<IArticle>('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

ArticleSchema.pre<IArticle>('save', async function (next) {
  const existing = await mongoose.models.Article.findOne({ slug: this.slug });

  if (existing && existing._id.toString() !== this._id.toString()) {
    this.slug = `${this.slug}-${Date.now()}`;
  }

  // If slug has changed, store old one in history
  if (this.isModified('slug') && !this.slugHistory?.includes(this.slug)) {
    this.slugHistory = [...(this.slugHistory || []), this.slug];
  }

  next();
});

/** ---------- Export Model ---------- **/
const ArticleModel =
  (mongoose.models.Article as Model<IArticle>) ||
  mongoose.model<IArticle>('Article', ArticleSchema);

export default ArticleModel;
