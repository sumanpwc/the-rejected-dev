import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import ArticleModel from '../models/Article';

// XML escape helper
const escapeXml = (unsafe: string) =>
  unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

// Core sitemap file generator (no req/res here)
export async function generateSitemapFile() {
  const articles = await ArticleModel.find({}, 'slug updatedAt').lean();

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles
    .map((a) => {
      const slug = escapeXml(a.slug);
      const lastmod = new Date(a.updatedAt).toISOString().split('T')[0];
      return `
  <url>
    <loc>https://yourdomain.com/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join('\n')}
</urlset>`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
}

// Express route handler
export const updateSitemap = async (req: Request, res: Response) => {
  try {
    await generateSitemapFile();
    return res.status(200).json({ message: '✅ Sitemap generated successfully.' });
  } catch (error: any) {
    console.error('❌ Sitemap generation failed:', error);
    return res.status(500).json({ error: 'Sitemap generation failed', details: error.message });
  }
};
