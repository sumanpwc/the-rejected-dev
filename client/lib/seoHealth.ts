import { ArticleType } from "@/types/ArticleType";

export interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint in ms
  FID: number; // First Input Delay in ms
  CLS: number; // Cumulative Layout Shift (unitless)
}

export interface SEOHealthReport {
  seoScore: number;
  wordCount: number;
  readingTime: number;
  keywordDensity: number;
  readabilityScore: number;
  missingFields: string[];
  suggestions: string[];
  coreWebVitalsIssues: string[];
//  mobileIssues: string[];
  duplicateContentIssues: string[];
}

// --- Utility Functions ---

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200); // avg 200 wpm
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  return (word.match(/[aeiouy]{1,2}/g) || []).length;
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return Math.round(
    206.835 -
      1.015 * (words.length / sentences) -
      84.6 * (syllables / words.length)
  );
}

function calculateKeywordDensity(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const allWords = text.toLowerCase().split(/\s+/);
  const keywordCount = keywords.reduce((count, kw) => {
    return count + allWords.filter(word => word.includes(kw.toLowerCase())).length;
  }, 0);
  return parseFloat(((keywordCount / allWords.length) * 100).toFixed(2));
}

function validateJSONLD(jsonld: any): boolean {
  try {
    if (!jsonld) return false;
    if (typeof jsonld === "string") JSON.parse(jsonld);
    else JSON.stringify(jsonld);
    return true;
  } catch {
    return false;
  }
}

function checkCoreWebVitals(vitals?: CoreWebVitals): string[] {
  if (!vitals) return ["Core Web Vitals data unavailable."];

  const issues: string[] = [];
  if (vitals.LCP > 2500) issues.push(`LCP is too high: ${vitals.LCP}ms (>2500ms).`);
  if (vitals.FID > 100) issues.push(`FID is too high: ${vitals.FID}ms (>100ms).`);
  if (vitals.CLS > 0.1) issues.push(`CLS is too high: ${vitals.CLS} (>0.1).`);

  return issues;
}

/*
function parseFontSize(fontSize?: string | number): number | undefined {
  if (typeof fontSize === "number") return fontSize;
  if (typeof fontSize === "string") {
    const numeric = parseFloat(fontSize);
    return isNaN(numeric) ? undefined : numeric;
  }
  return undefined;
}

function checkMobileFriendly(article: ArticleType): string[] {
  const issues: string[] = [];
  if (!article.viewportMeta)
    issues.push("Missing viewport meta tag for mobile responsiveness.");

  const fontSizeNum = parseFontSize(article.fontSize);
  if ((fontSizeNum || 0) < 14)
    issues.push("Font size should be at least 14px for readability.");

  return issues;
}
*/
function detectDuplicateContent(content: string, others: string[]): boolean {
  const tokenize = (t: string) => new Set(t.toLowerCase().split(/\W+/).filter(Boolean));
  const jaccard = (a: Set<string>, b: Set<string>) => {
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return intersection.size / union.size;
  };

  const contentSet = tokenize(content);
  return others.some(other => jaccard(contentSet, tokenize(other)) > 0.85);
}

function checkKeywordCoverage(article: ArticleType): number {
  const keywords = article.keywords?.map(k => k.toLowerCase()) || [];
  if (!keywords.length) return 0;

  const title = article.title?.toLowerCase() || "";
  const desc = article.metaDescription?.toLowerCase() || "";
  const headings = article.headings?.map(h => h.text.toLowerCase()).join(" ") || "";

  let count = 0;
  keywords.forEach(kw => {
    if (title.includes(kw)) count++;
    if (desc.includes(kw)) count++;
    if (headings.includes(kw)) count++;
  });
  return count;
}

// --- Main SEO Health Function ---

export function getSEOHealth(
  article: ArticleType,
  coreWebVitals?: CoreWebVitals,
  otherArticlesContent: string[] = []
): SEOHealthReport {
  const fullEssence = article.headings?.map(h => h.essence || "").join("\n\n") || "";
  const wordCount = countWords(fullEssence);
  const readingTime = estimateReadingTime(wordCount);
  const readabilityScore = calculateReadability(fullEssence);
  const keywordDensity = calculateKeywordDensity(fullEssence, article.keywords || []);

  const missingFields: string[] = [];
  const suggestions: string[] = [];

  // --- Meta Checks ---
  if (!article.title || article.title.length < 50 || article.title.length > 70) {
    missingFields.push("title");
    suggestions.push("Title should be 50–70 characters long and keyword-rich.");
  }

  if (!article.metaDescription || article.metaDescription.length < 120 || article.metaDescription.length > 160) {
    missingFields.push("metaDescription");
    suggestions.push("Meta description should be 120–160 characters.");
  }

  if (!article.keywords || article.keywords.length < 3) {
    missingFields.push("keywords");
    suggestions.push("Add at least 3 relevant keywords.");
  }

  if (!article.ogMeta?.image) {
    missingFields.push("og:image");
    suggestions.push("Add an Open Graph image for social sharing.");
  }

  if (!article.canonicalUrl) {
    missingFields.push("canonicalUrl");
    suggestions.push("Specify a canonical URL to avoid duplicates.");
  }

  // --- Headings Structure ---
  if (!article.headings?.some(h => h.type === "h2")) {
    missingFields.push("h2");
    suggestions.push("Add at least one H2 heading.");
  }

  if (!article.headings?.some(h => h.type === "h3")) {
    suggestions.push("Include H3 subheadings to structure content.");
  }

  // --- Content Quality ---
  if (wordCount < 1300) suggestions.push("Content length is below 1300 words.");
  if (keywordDensity < 0.5) suggestions.push("Keyword density is too low (<0.5%).");
  if (readabilityScore < 60) suggestions.push("Improve readability score to above 60.");

  // --- Cover Image Alt Text ---
  if (!article.title?.trim()) {
    missingFields.push("coverImageAlt");
    suggestions.push("Add descriptive alt text to the cover image.");
  }

  // --- Links ---
  if (!article.internalLinks?.length) suggestions.push("Add internal links to related content.");
  if (!article.externalLinks?.length) suggestions.push("Add authoritative external links.");

  // --- Structured Data ---
  if (!article.structuredData || !validateJSONLD(article.structuredData)) {
    missingFields.push("structuredData");
    suggestions.push("Add valid JSON-LD structured data.");
  }

  // --- Keyword Coverage ---
  const keywordCoverage = checkKeywordCoverage(article);
  if (keywordCoverage < Math.min(3, article.keywords?.length || 0)) {
    suggestions.push("Ensure keywords are present in title, meta description, and headings.");
  }

  // --- Core Web Vitals ---
  const coreWebVitalsIssues = checkCoreWebVitals(coreWebVitals);
  suggestions.push(...coreWebVitalsIssues);

  // --- Mobile Friendly ---
  // const mobileIssues = checkMobileFriendly(article);
  // suggestions.push(...mobileIssues);

  // --- Duplicate Content ---
  const duplicateContentIssues: string[] = [];
  if (detectDuplicateContent(fullEssence, otherArticlesContent)) {
    duplicateContentIssues.push("This content appears to be duplicated.");
    suggestions.push(...duplicateContentIssues);
  }

  // --- Scoring ---
  let score = 100;
  const penalties = {
    missingField: 5,
    shortContent: 10,
    lowKeywordDensity: 5,
    lowReadability: 10,
    keywordCoverage: 5,
    missingInternalLinks: 3,
    missingExternalLinks: 2,
    missingAltText: 3,
    invalidStructuredData: 7,
    canonicalMissing: 5,
    coreWebVitalsIssues: 7,
    mobileIssues: 5,
    duplicateContent: 15,
  };

  score -= missingFields.length * penalties.missingField;
  if (wordCount < 1000) score -= penalties.shortContent;
  if (keywordDensity < 0.5) score -= penalties.lowKeywordDensity;
  if (readabilityScore < 60) score -= penalties.lowReadability;
  if (keywordCoverage < Math.min(3, article.keywords?.length || 0)) score -= penalties.keywordCoverage;
  if (!article.internalLinks?.length) score -= penalties.missingInternalLinks;
  if (!article.externalLinks?.length) score -= penalties.missingExternalLinks;
  if (!article.title?.trim()) score -= penalties.missingAltText;
  if (!article.structuredData || !validateJSONLD(article.structuredData)) score -= penalties.invalidStructuredData;
  if (!article.canonicalUrl) score -= penalties.canonicalMissing;
  if (coreWebVitalsIssues.length > 0) score -= penalties.coreWebVitalsIssues;
 // if (mobileIssues.length > 0) score -= penalties.mobileIssues;
  if (duplicateContentIssues.length > 0) score -= penalties.duplicateContent;

  score = Math.max(0, Math.min(100, score));

  return {
    seoScore: score,
    wordCount,
    readingTime,
    keywordDensity,
    readabilityScore,
    missingFields,
    suggestions,
    coreWebVitalsIssues,
//  mobileIssues,
    duplicateContentIssues,
  };
}
