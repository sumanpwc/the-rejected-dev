import { Request, Response } from 'express';
import ArticleModel from '../models/Article';
import { generateSitemapFile } from './sitemapController';

// Create new Article
export const createArticle = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.title || !data.slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const existing = await ArticleModel.findOne({ slug: data.slug });
    if (existing) {
      return res.status(409).json({ error: 'Article with this slug already exists' });
    }

    const article = new ArticleModel(data);
    await article.save();

    // Regenerate sitemap immediately after new article is saved
    //await generateSitemapFile();

    return res.status(201).json(article);
  } catch (error: any) {
    console.error('Error creating article:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
/*
export const createArticle = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Optional: Validate required fields before creating the document
    if (!data.title || !data.slug) {
      return res.status(400).json({ error: "Title and slug are required to create an Article." });
    }

    // Optional: Check for duplicate slug (if slugs must be unique)
    const existing = await ArticleModel.findOne({ slug: data.slug });
    if (existing) {
      return res.status(409).json({ error: "An article with this slug already exists." });
    }

    const article = new ArticleModel(data);
    await article.save();

    return res.status(201).json(article);
  } catch (error: any) {
    console.error("Error creating article:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};
*/
// Get paginated list of Articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page)) || 1;
    const limit = Math.min(50, Number(req.query.limit)) || 6;

    // Extract filters
    const tagQuery = req.query.tag || req.query.tags;
    const tags = typeof tagQuery === "string"
      ? tagQuery.split(",").map((tag) => tag.trim())
      : [];

    const search = typeof req.query.search === "string" ? req.query.search : "";
    const isFeatured = req.query.featured === "true";
    const isPinned = req.query.pinned === "true";

    // Build MongoDB filter
    const filter: Record<string, any> = { isPublished: true };

    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { metaDescription: regex },
        { content: regex },
      ];
    }

    if (isFeatured) filter.isFeatured = true;
    if (isPinned) filter.isPinned = true;

    // Count total matching documents
    const total = await ArticleModel.countDocuments(filter);

    // Fetch paginated results
    const articles = await ArticleModel.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      //.select("title slug metaDescription coverImage tags author createdAt isFeatured isPinned")
      .lean();

    // Optional: Fetch all distinct tags (for frontend filters)
    const allTags = await ArticleModel.distinct("tags", { isPublished: true });

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      allTags,
      data: articles,
    });

  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get single Article by slug
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Invalid slug parameter' });
    }

    const article = await ArticleModel.findOne({ slug, isPublished: true }).lean().exec();

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.status(200).json(article);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};


// Update article by ID
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await ArticleModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete article by ID
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ArticleModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    return res.json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
