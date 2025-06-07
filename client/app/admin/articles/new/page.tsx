"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/button/Button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { createArticle } from "@/lib/api";

// Dynamic Markdown Editor (same as before)
const MarkdownEditor = dynamic(() => import("@/components/editor/MarkdownEditor"), { ssr: false });

// Util for URL validation
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const CODE_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "bash",
  "java",
  "other",
] as const;

const TWITTER_CARD_TYPES = [
  "summary",
  "summary_large_image",
  "app",
  "player",
];

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

export default function NewArticlePage() {
  const router = useRouter();

  // Base Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // SEO & Social Meta
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [canonicalUrlError, setCanonicalUrlError] = useState("");

  const [ogMeta, setOgMeta] = useState({
    title: "",
    description: "",
    image: "",
    type: "", // empty string means "not set"
  });
  const [ogImageError, setOgImageError] = useState("");

  const [twitterMeta, setTwitterMeta] = useState({
    title: "",
    description: "",
    image: "",
    cardType: "summary",
  });
  const [twitterImageError, setTwitterImageError] = useState("");

  // Publishing
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");

  // Links
  const [internalLinks, setInternalLinks] = useState<string[]>([""]);
  const [externalLinks, setExternalLinks] = useState<string[]>([""]);

  // Structured Data (JSON)
  const [structuredData, setStructuredData] = useState("");
  const [structuredDataError, setStructuredDataError] = useState("");

  // Dynamic Arrays (existing)
  const [headings, setHeadings] = useState<HeadingType[]>([]);
  type CodeLanguage =
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'html'
    | 'css'
    | 'json'
    | 'bash'
    | 'other';

  interface CodeBlock {
    code: string;
    language: CodeLanguage;
    caption?: string;
  }

  interface ImageAsset {
    alt: string;
    url: string;
  }

  interface HeadingType {
    type: 'h2' | 'h3';
    text: string;
    essence: string;
    images: ImageAsset[];
    codeBlocks: CodeBlock[];
  }
  const [newHeadingType, setNewHeadingType] = useState<"h2" | "h3">("h2"); // default type
  const [codeBlocks, setCodeBlocks] = useState([{ code: "", language: "javascript", caption: "" }]);
  const [faqSchema, setFaqSchema] = useState([{ question: "", answer: "" }]);

  // Read Time (auto + manual)
  const [readTime, setReadTime] = useState<number | "">("");
  const [readTimeOverride, setReadTimeOverride] = useState(false);

  // Auto-calc readTime on content change
  useEffect(() => {
    if (!readTimeOverride) {
      const totalEssence = headings.map(h => h.essence || "").join(" ");
      const words = totalEssence.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200); // avg 200 wpm
      setReadTime(time || "");
    }
  }, [headings, readTimeOverride]);

  // Slug validation (only letters, numbers, hyphens)
  const validateSlug = (s: string) => {
    if (!s) {
      setSlugError("Slug is required.");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(s)) {
      setSlugError("Slug can only contain lowercase letters, numbers and hyphens.");
      return false;
    }
    setSlugError("");
    return true;
  };

  // URL validation with optional empty allowed
  const validateUrlField = (url: string, setError: (msg: string) => void) => {
    if (url && !isValidUrl(url)) {
      setError("Invalid URL");
      return false;
    }
    setError("");
    return true;
  };

  // Submit Handler with validation
  const handleSubmit = async () => {
    // Validate slug
    if (!validateSlug(slug)) {
      toast.error("Fix slug errors before submitting");
      return;
    }
    // Validate URLs
    if (!validateUrlField(canonicalUrl, setCanonicalUrlError)) return toast.error("Fix canonical URL");
    if (!validateUrlField(ogMeta.image, setOgImageError)) return toast.error("Fix OG Image URL");
    if (!validateUrlField(twitterMeta.image, setTwitterImageError)) return toast.error("Fix Twitter Image URL");

    // Validate structuredData JSON syntax if present
    if (structuredData.trim()) {
      try {
        JSON.parse(structuredData);
        setStructuredDataError("");
      } catch {
        setStructuredDataError("Invalid JSON");
        return toast.error("Fix Structured Data JSON");
      }
    }

    // Validate internalLinks & externalLinks URLs
    for (const url of internalLinks) {
      if (url && !isValidUrl(url)) {
        toast.error("Fix invalid internal link URLs");
        return;
      }
    }
    for (const url of externalLinks) {
      if (url && !isValidUrl(url)) {
        toast.error("Fix invalid external link URLs");
        return;
      }
    }

    const payload = {
      title,
      slug,
      metaDescription,
      keywords,
      tags,
      author,
      coverImage,
      canonicalUrl,
      ogMeta,
      twitterMeta,
      readTime: typeof readTime === "number" ? readTime : undefined,
      isPublished,
      isFeatured,
      isPinned,
      publishedAt: publishedAt || undefined,
      internalLinks: internalLinks.filter(Boolean),
      externalLinks: externalLinks.filter(Boolean),
      structuredData: structuredData ? JSON.parse(structuredData) : undefined,
      headings,
      codeBlocks,
      faqSchema,
    };

    try {
      const res = createArticle(payload); 
      toast.success("Article created successfully!");
      console.log("Article Create Response: ", res);
      router.push("/admin/articles");
    } catch (err: any) {
      toast.error(err.message || "Error creating article");
    }
  };

  // Helper for dynamic link inputs (internal + external)
  const handleLinkChange = (
    links: string[],
    setLinks: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number,
    val: string
  ) => {
    const updated = [...links];
    updated[idx] = val;
    setLinks(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-blue-950">Create New Article</h1>

      <Card>
        <CardContent className="space-y-4 p-6">

          {/* Title + Slug */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setTitle(newTitle);

              if (!isSlugEdited) {
                setSlug(generateSlugFromTitle(newTitle));
              }
            }}
          />
          <Input
            placeholder="Slug"
            value={slug}
            readOnly
          />
          
          <Textarea
            placeholder="Meta Description (max 160 chars)"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={160}
          />

          {/* Keywords + Tags */}
          <Input
            placeholder="Keywords (comma separated)"
            value={keywords.join(", ")}
            onChange={(e) => setKeywords(e.target.value.split(",").map(k => k.trim()).filter(Boolean))}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tags.join(", ")}
            onChange={(e) => setTags(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
          />

          <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <Input
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />   

          {/* Canonical URL */}
          <Input
            placeholder="Canonical URL"
            value={canonicalUrl}
            onChange={(e) => {
              setCanonicalUrl(e.target.value);
              validateUrlField(e.target.value, setCanonicalUrlError);
            }}
            className={canonicalUrlError ? "border-red-500" : ""}
          />
          {canonicalUrlError && <p className="text-red-600 text-sm">{canonicalUrlError}</p>}

          {/* Read Time (auto + override) */}
          <div className="flex items-center space-x-3">
            <label>Read Time (minutes):</label>
            <Input
              type="number"
              value={typeof readTime === "number" ? readTime : ""}
              disabled={!readTimeOverride}
              onChange={(e) => setReadTime(Number(e.target.value))}
              min={1}
              max={120}
              className="w-20"
            />
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={readTimeOverride}
                onChange={() => setReadTimeOverride(!readTimeOverride)}
              />
              <span>Override</span>
            </label>
          </div>

          {/* Internal Links */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Internal Links</h2>
            {internalLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={link}
                  placeholder="Internal URL"
                  onChange={(e) =>
                    handleLinkChange(internalLinks, setInternalLinks, i, e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button" // Prevents accidental form submission
                  onClick={() =>
                    setInternalLinks((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              type="button" // Prevents accidental form submission
              onClick={() => setInternalLinks([...internalLinks, ""])}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Internal Link
            </Button>
          </div>
          
          {/* External Links */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">External Links</h2>
            {externalLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={link}
                  placeholder="External URL"
                  onChange={(e) => handleLinkChange(externalLinks, setExternalLinks, i, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => setExternalLinks(prev => prev.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setExternalLinks([...externalLinks, ""])}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add External Link
            </Button>
          </div>

          {/* Headings */}
          {/* (Your existing headings UI here) */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Headings / Sections</h2>

            {headings.map((h, i) => (
              <div key={i} className="space-y-3 border p-4 rounded-md">
                <div className="flex gap-2 items-center">
                  <select
                    value={h.type}
                    onChange={(e) => {
                      const updated = [...headings];
                      updated[i].type = e.target.value as 'h2' | 'h3';
                      setHeadings(updated);
                    }}
                  >
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                  </select>
                  <Input
                    value={h.text}
                    onChange={(e) => {
                      const updated = [...headings];
                      updated[i].text = e.target.value;
                      setHeadings(updated);
                    }}
                    placeholder="Heading text"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHeadings((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Markdown Content */}
                <div>
                  <label className="block font-medium mb-1">Content</label>
                  <MarkdownEditor
                    value={h.essence}
                    onChange={(value) => {
                      const updated = [...headings];
                      updated[i].essence = value;
                          function extractImagesWithAlt(content: string): ImageAsset[] {
                            const regex = /!\[(.*?)\]\((.*?)(?: "(.*?)")?\)/g;
                            const images: ImageAsset[] = [];

                            let match;
                            while ((match = regex.exec(content)) !== null) {
                              const alt = match[1].trim();
                              const url = match[2].trim().split(" ")[0]; // Remove any trailing title or extra
                              images.push({ alt, url });
                            }

                            return images;
                          }
                      updated[i].images = extractImagesWithAlt(h.essence);
                      setHeadings(updated);
                    }}
                  />
                </div>

                {/* Code Blocks */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-md">Code Blocks</h3>
                  {(h.codeBlocks || []).map((cb, j) => (
                    <div key={j} className="space-y-2 border p-2 rounded-md">
                      <select
                        value={cb.language}
                        onChange={(e) => {
                          const updated = [...headings];
                          updated[i].codeBlocks[j].language = e.target.value as CodeLanguage;
                          setHeadings(updated);
                        }}
                      >
                        {CODE_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                      <Textarea
                        value={cb.code}
                        onChange={(e) => {
                          const updated = [...headings];
                          updated[i].codeBlocks[j].code = e.target.value;
                          setHeadings(updated);
                        }}
                        placeholder="Code"
                      />
                      <Input
                        value={cb.caption}
                        onChange={(e) => {
                          const updated = [...headings];
                          updated[i].codeBlocks[j].caption = e.target.value;
                          setHeadings(updated);
                        }}
                        placeholder="Caption (optional)"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = [...headings];
                          updated[i].codeBlocks = updated[i].codeBlocks.filter((_, k) => k !== j);
                          setHeadings(updated);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updated = [...headings];
                      if (!updated[i].codeBlocks) updated[i].codeBlocks = [];
                      updated[i].codeBlocks.push({ code: '', language: 'javascript', caption: '' });
                      setHeadings(updated);
                    }}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Code Block
                  </Button>
                </div>
              </div>
            ))}

            {/* Add New Section */}
            <div className="flex items-center gap-2">
              <select
                value={newHeadingType}
                onChange={(e) => setNewHeadingType(e.target.value as 'h2' | 'h3')}
              >
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </select>

              <Button
                variant="outline"
                onClick={() =>
                  setHeadings([
                    ...headings,
                    {
                      type: newHeadingType,
                      text: '',
                      essence: '',
                      codeBlocks: [],
                      images: [],
                    },
                  ])
                }
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Section
              </Button>
            </div>
          </div>          

          {/* FAQs (existing) */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">FAQs</h2>
            {faqSchema.map((faq, i) => (
              <div key={i} className="space-y-2 border p-2 rounded-md">
                <Input
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqSchema];
                    updated[i].question = e.target.value;
                    setFaqSchema(updated);
                  }}
                  placeholder="FAQ Question"
                />
                <Textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqSchema];
                    updated[i].answer = e.target.value;
                    setFaqSchema(updated);
                  }}
                  placeholder="FAQ Answer"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFaqSchema((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setFaqSchema([...faqSchema, { question: "", answer: "" }])}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </div>

          {/* Open Graph Metadata */}
          <div className="space-y-2">
          <h2 className="font-semibold text-lg">Open Graph Metadata</h2>

          <Input
            placeholder="OG Title"
            value={ogMeta.title}
            onChange={(e) => setOgMeta({ ...ogMeta, title: e.target.value })}
          />

          <Textarea
            placeholder="OG Description"
            value={ogMeta.description}
            onChange={(e) => setOgMeta({ ...ogMeta, description: e.target.value })}
          />

          <Input
            placeholder="OG Image URL"
            value={ogMeta.image}
            onChange={(e) => {
              setOgMeta({ ...ogMeta, image: e.target.value });
              validateUrlField(e.target.value, setOgImageError);
            }}
            className={ogImageError ? "border-red-500" : ""}
          />
          {ogImageError && <p className="text-red-600 text-sm">{ogImageError}</p>}

          <select
            className="w-full border rounded px-3 py-2"
            value={ogMeta.type || ""}
            onChange={(e) => setOgMeta({ ...ogMeta, type: e.target.value })}
          >
            <option value="">Select OG Type (optional)</option>
            <option value="website">Website</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="profile">Profile</option>
            <option value="custom">Other (Custom)</option>
          </select>

          {ogMeta.type === "custom" && (
            <Input
              placeholder="Enter custom OG Type"
              onChange={(e) => setOgMeta({ ...ogMeta, type: e.target.value })}
            />
          )}
        </div>

          {/* Twitter Metadata */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Twitter Metadata</h2>
            <Input
              placeholder="Twitter Title"
              value={twitterMeta.title}
              onChange={(e) => setTwitterMeta({ ...twitterMeta, title: e.target.value })}
            />
            <Textarea
              placeholder="Twitter Description"
              value={twitterMeta.description}
              onChange={(e) => setTwitterMeta({ ...twitterMeta, description: e.target.value })}
            />
            <Input
              placeholder="Twitter Image URL"
              value={twitterMeta.image}
              onChange={(e) => {
                setTwitterMeta({ ...twitterMeta, image: e.target.value });
                validateUrlField(e.target.value, setTwitterImageError);
              }}
              className={twitterImageError ? "border-red-500" : ""}
            />
            {twitterImageError && <p className="text-red-600 text-sm">{twitterImageError}</p>}

            <select
              value={twitterMeta.cardType}
              onChange={(e) => setTwitterMeta({ ...twitterMeta, cardType: e.target.value })}
            >
              {TWITTER_CARD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Publishing toggles */}
          <div className="space-x-4 flex flex-wrap items-center">
            <label>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={() => setIsPublished(!isPublished)}
              />{" "}
              Published
            </label>
            <label>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={() => setIsFeatured(!isFeatured)}
              />{" "}
              Featured
            </label>
            <label>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={() => setIsPinned(!isPinned)}
              />{" "}
              Pinned
            </label>
            {isPublished && (
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="border rounded px-2 py-1"
              />
            )}
          </div>

          {/* Structured Data JSON */}
          <div>
            <label className="block font-medium mb-1">Structured Data (JSON-LD)</label>
            <Textarea
              value={structuredData}
              onChange={(e) => setStructuredData(e.target.value)}
              placeholder="Paste JSON-LD here"
              className={structuredDataError ? "border-red-500" : ""}
              rows={6}
            />
            {structuredDataError && <p className="text-red-600 text-sm">{structuredDataError}</p>}
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="mt-4" size="lg">
            Create Article
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
