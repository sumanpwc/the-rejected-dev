"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/button/Button";
import { CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { createArticle } from "@/lib/api";

// Dynamically import Markdown editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import("@/components/editor/MarkdownEditor"), { ssr: false });

/* ---------------- Utilities ---------------- */
const isValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function countWords(text: string): number {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}
function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

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

type CodeLanguage = typeof CODE_LANGUAGES[number];

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
  type: "h2" | "h3";
  text: string;
  essence: string;
  images: ImageAsset[];
  codeBlocks: CodeBlock[];
}

type ErrorMap = Record<string, string>;

/* -------------- Component ------------------ */
export default function NewArticlePage() {
  const router = useRouter();

  /* ---------- Base fields ---------- */
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");

  /* ---------- SEO / Social ---------- */
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogMeta, setOgMeta] = useState({ title: "", description: "", image: "", type: "" });
  const [customOgType, setCustomOgType] = useState("");

  const [twitterMeta, setTwitterMeta] = useState({
    title: "",
    description: "",
    image: "",
    cardType: "summary" as "summary" | "summary_large_image",
  });

  /* ---------- Publishing ---------- */
  // Now required: user must check Published before submit
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");

  /* ---------- Links ---------- */
  const [internalLinks, setInternalLinks] = useState<string[]>([""]);
  const [externalLinks, setExternalLinks] = useState<string[]>([""]);

  /* ---------- Structured data ---------- */
  const [structuredData, setStructuredData] = useState("");
  const [structuredDataError, setStructuredDataError] = useState("");

  /* ---------- Dynamic arrays ---------- */
  const [headings, setHeadings] = useState<HeadingType[]>([]);
  const [newHeadingType, setNewHeadingType] = useState<"h2" | "h3">("h2");
  const [faqSchema, setFaqSchema] = useState<{ question: string; answer: string }[]>([
    { question: "", answer: "" },
  ]);

  /* ---------- Misc ---------- */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- Validation ---------- */
  const [formErrors, setFormErrors] = useState<ErrorMap>({});
  const setFieldError = (id: string, message: string) =>
    setFormErrors((prev) => ({ ...prev, [id]: message }));
  const clearFieldError = (id: string) =>
    setFormErrors((prev) => {
      if (!(id in prev)) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

  const scrollToField = (id: string) => {
    const el = document.querySelector(`[data-error-id="${id}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const inner = el.querySelector("input, textarea, select, [contenteditable='true']") as
        | HTMLElement
        | null;
      if (inner && typeof inner.focus === "function") inner.focus();
    }
  };

  /* ---------- Effects ---------- */
  // slug auto-generated (locked input)
  useEffect(() => {
    setSlug(generateSlugFromTitle(title));
    clearFieldError("slug");
  }, [title]);

  // structured data live parse
  useEffect(() => {
    if (!structuredData.trim()) {
      setStructuredDataError("");
      clearFieldError("structuredData");
      return;
    }
    try {
      JSON.parse(structuredData);
      setStructuredDataError("");
      clearFieldError("structuredData");
    } catch {
      setStructuredDataError("Invalid JSON");
      setFieldError("structuredData", "Invalid JSON");
    }
  }, [structuredData]);

  /* ---------- Helpers ---------- */
  function extractImagesWithAlt(content: string): ImageAsset[] {
    const regex = /!\[(.*?)\]\((.*?)(?: "(.*?)")?\)/g;
    const images: ImageAsset[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const alt = match[1].trim();
      const url = match[2].trim().split(" ")[0];
      images.push({ alt, url });
    }
    return images;
  }

  const joinForInput = (arr: string[]) => arr.join(", ");
  const parseCommaInput = (val: string) => val.split(",").map((s) => s.trim()).filter(Boolean);

  const validateSlugFormat = (s: string) => {
    if (!s) {
      setFieldError("slug", "Slug is required");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(s)) {
      setFieldError("slug", "Slug can only contain lowercase letters, numbers and hyphens");
      return false;
    }
    clearFieldError("slug");
    return true;
  };

  const validateUrlField = (url: string, id: string) => {
    if (!url) {
      clearFieldError(id);
      return true;
    }
    if (!isValidUrl(url)) {
      setFieldError(id, "Invalid URL");
      return false;
    }
    clearFieldError(id);
    return true;
  };

  /* ---------- Central per-field validator (live + submit) ---------- */
  const validateField = (field: string, value?: any) => {
    // returns boolean valid
    switch (field) {
      case "title": {
        if (!value?.trim()) {
          setFieldError("title", "Title is required");
          return false;
        }
        clearFieldError("title");
        return true;
      }

      case "metaDescription": {
        if (!value?.trim()) {
          setFieldError("metaDescription", "Meta description is required");
          return false;
        }
        clearFieldError("metaDescription");
        return true;
      }

      case "keywords": {
        if (!value || value.length === 0) {
          setFieldError("keywords", "At least one keyword is required");
          return false;
        }
        clearFieldError("keywords");
        return true;
      }

      case "tags": {
        if (!value || value.length === 0) {
          setFieldError("tags", "At least one tag is required");
          return false;
        }
        clearFieldError("tags");
        return true;
      }

      case "author": {
        if (!value?.trim()) {
          setFieldError("author", "Author is required");
          return false;
        }
        clearFieldError("author");
        return true;
      }

      case "slug": {
        return validateSlugFormat(value);
      }

      case "canonicalUrl": {
        return validateUrlField(value || "", "canonicalUrl");
      }

      case "og_image": {
        return validateUrlField(value || "", "og_image");
      }

      case "twitter_image": {
        return validateUrlField(value || "", "twitter_image");
      }

      case "og_type": {
        if (!value || value === "") {
          setFieldError("og_type", "OG Type is required");
          return false;
        }
        clearFieldError("og_type");
        return true;
      }

      case "og_custom_type": {
        if (ogMeta.type === "custom") {
          if (!value?.trim()) {
            setFieldError("og_custom_type", "Custom OG Type is required");
            return false;
          }
          clearFieldError("og_custom_type");
        } else {
          clearFieldError("og_custom_type");
        }
        return true;
      }

      case "isPublished": {
        // Now the Published checkbox itself is required before submit
        if (!value) {
          setFieldError("isPublished", "You must mark the article as Published before submitting");
          return false;
        }
        clearFieldError("isPublished");
        return true;
      }

      case "publishedAt": {
        if (isPublished) {
          if (!value) {
            setFieldError("publishedAt", "Publish date is required when publishing");
            return false;
          }
          // compare local dates (strip time)
          const today = new Date();
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const sel = new Date(value);
          const selStart = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate());
          if (selStart < todayStart) {
            setFieldError("publishedAt", "Publish date cannot be in the past");
            return false;
          }
          clearFieldError("publishedAt");
          return true;
        } else {
          clearFieldError("publishedAt");
          return true;
        }
      }

      case "structuredData": {
        if (!value?.trim()) {
          clearFieldError("structuredData");
          return true;
        }
        try {
          JSON.parse(value);
          clearFieldError("structuredData");
          return true;
        } catch {
          setFieldError("structuredData", "Invalid JSON");
          return false;
        }
      }

      default:
        return true;
    }
  };

  /* ---------- Link handlers ---------- */
  const handleInternalLinkChange = (idx: number, value: string) => {
    const updated = [...internalLinks];
    updated[idx] = value;
    setInternalLinks(updated);
    validateUrlField(value, `internal_${idx}`);
  };

  const handleExternalLinkChange = (idx: number, value: string) => {
    const updated = [...externalLinks];
    updated[idx] = value;
    setExternalLinks(updated);
    validateUrlField(value, `external_${idx}`);
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const errors: { id: string; message: string }[] = [];

    // Run central validations
    if (!validateField("title", title)) errors.push({ id: "title", message: formErrors["title"] || "Title required" });
    if (!validateField("slug", slug)) errors.push({ id: "slug", message: formErrors["slug"] || "Slug invalid" });
    if (!validateField("metaDescription", metaDescription)) errors.push({ id: "metaDescription", message: formErrors["metaDescription"] || "Meta required" });
    if (!validateField("keywords", keywords)) errors.push({ id: "keywords", message: formErrors["keywords"] || "Keywords required" });
    if (!validateField("tags", tags)) errors.push({ id: "tags", message: formErrors["tags"] || "Tags required" });
    if (!validateField("author", author)) errors.push({ id: "author", message: formErrors["author"] || "Author required" });

    // Published checkbox is REQUIRED — block submission if not checked
    if (!validateField("isPublished", isPublished)) {
      errors.push({ id: "isPublished", message: formErrors["isPublished"] || "Article must be published" });
    } else {
      // If published, publishedAt must be valid
      if (!validateField("publishedAt", publishedAt)) {
        errors.push({ id: "publishedAt", message: formErrors["publishedAt"] || "Publish date issue" });
      }
    }

    // Headings (dynamic)
    if (!headings.length) {
      errors.push({ id: "headings", message: "At least one section (heading) is required" });
      setFieldError("headings", "At least one section (heading) is required");
    } else {
      clearFieldError("headings");
      headings.forEach((h, idx) => {
        if (!h.text.trim()) {
          errors.push({ id: `heading_${idx}_text`, message: `Heading ${idx + 1}: Title is required` });
          setFieldError(`heading_${idx}_text`, `Heading ${idx + 1}: Title is required`);
        }
        if (!h.essence.trim()) {
          errors.push({ id: `heading_${idx}_essence`, message: `Heading ${idx + 1}: Content is required` });
          setFieldError(`heading_${idx}_essence`, `Heading ${idx + 1}: Content is required`);
        }
        (h.images || []).forEach((img, imIdx) => {
          if (img.url && !isValidUrl(img.url)) {
            errors.push({ id: `heading_${idx}_image_${imIdx}`, message: `Heading ${idx + 1} image ${imIdx + 1} URL is invalid` });
            setFieldError(`heading_${idx}_image_${imIdx}`, "Image URL is invalid");
          }
        });
        (h.codeBlocks || []).forEach((cb, cbIdx) => {
          if (typeof cb.code === "string" && cb.code.trim() === "") {
            errors.push({ id: `heading_${idx}_code_${cbIdx}`, message: `Heading ${idx + 1} code block ${cbIdx + 1} must not be empty` });
            setFieldError(`heading_${idx}_code_${cbIdx}`, "Code block must not be empty");
          }
        });
      });
    }

    // FAQs
    faqSchema.forEach((f, i) => {
      if (!f.question.trim()) {
        errors.push({ id: `faq_${i}_question`, message: `FAQ ${i + 1}: Question is required` });
        setFieldError(`faq_${i}_question`, "Question is required");
      }
      if (!f.answer.trim()) {
        errors.push({ id: `faq_${i}_answer`, message: `FAQ ${i + 1}: Answer is required` });
        setFieldError(`faq_${i}_answer`, "Answer is required");
      }
    });

    // Canonical / OG / Twitter URL validation
    if (!validateField("canonicalUrl", canonicalUrl)) errors.push({ id: "canonicalUrl", message: formErrors["canonicalUrl"] || "Canonical URL invalid" });
    if (!validateField("og_image", ogMeta.image)) errors.push({ id: "og_image", message: formErrors["og_image"] || "OG image invalid" });
    if (!validateField("twitter_image", twitterMeta.image)) errors.push({ id: "twitter_image", message: formErrors["twitter_image"] || "Twitter image invalid" });

    // OG Type & custom
    if (!validateField("og_type", ogMeta.type)) errors.push({ id: "og_type", message: formErrors["og_type"] || "OG Type required" });
    if (!validateField("og_custom_type", customOgType)) errors.push({ id: "og_custom_type", message: formErrors["og_custom_type"] || "Custom OG Type required" });

    // Link URL checks
    internalLinks.forEach((url, idx) => {
      if (url && !isValidUrl(url)) {
        errors.push({ id: `internal_${idx}`, message: `Internal link ${idx + 1} is invalid: ${url}` });
        setFieldError(`internal_${idx}`, "Invalid internal URL");
      } else clearFieldError(`internal_${idx}`);
    });
    externalLinks.forEach((url, idx) => {
      if (url && !isValidUrl(url)) {
        errors.push({ id: `external_${idx}`, message: `External link ${idx + 1} is invalid: ${url}` });
        setFieldError(`external_${idx}`, "Invalid external URL");
      } else clearFieldError(`external_${idx}`);
    });

    // Structured data final check
    if (!validateField("structuredData", structuredData)) errors.push({ id: "structuredData", message: formErrors["structuredData"] || "Structured Data invalid" });

    // If any errors exist, produce clickable toast & scroll to first error
    if (Object.keys(formErrors).length > 0 || errors.length > 0) {
      // pick first error id (prefer explicit errors array order)
      const first = errors.length > 0 ? errors[0].id : Object.keys(formErrors)[0];
      if (first) scrollToField(first);

      // dedupe and build toast list
      const combined = [
        ...errors,
        ...Object.keys(formErrors)
          .filter((id) => !errors.find((e) => e.id === id))
          .map((id) => ({ id, message: formErrors[id] })),
      ];

      const dedup: Record<string, string> = {};
      combined.forEach((e) => {
        if (!dedup[e.id]) dedup[e.id] = e.message;
      });

      toast.error(
        <div>
          <p className="font-semibold">Please fix the following:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1 text-sm">
            {Object.entries(dedup).map(([id, msg]) => (
              <li key={id} className="cursor-pointer hover:underline" onClick={() => scrollToField(id)}>
                {msg}
              </li>
            ))}
          </ul>
        </div>,
        { duration: 12000 }
      );

      setIsSubmitting(false);
      return;
    }

    // Build payload if valid
    const fullEssence = headings?.map((h) => h.essence || "").join("\n\n") || "";
    const wordCount = countWords(fullEssence);
    const readingTime = estimateReadingTime(wordCount);

    const payload = {
      title,
      slug,
      metaDescription,
      keywords,
      tags,
      author,
      coverImage,
      canonicalUrl: canonicalUrl || undefined,
      ogMeta: {
        ...ogMeta,
        type: ogMeta.type === "custom" ? customOgType : ogMeta.type,
      },
      twitterMeta,
      readTime: readingTime,
      isPublished,
      isFeatured,
      isPinned,
      publishedAt: publishedAt || undefined,
      internalLinks: internalLinks.filter(Boolean),
      externalLinks: externalLinks.filter(Boolean),
      structuredData: structuredData ? JSON.parse(structuredData) : undefined,
      headings,
      faqSchema,
    };

    try {
      const res = await createArticle(payload);
      toast.success("Article created successfully!");
      router.push("/admin/articles");
    } catch (err: any) {
      toast.error(err?.message || "Error creating article");
      console.error("Create article error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Live UI helpers ---------- */
  const liveWordCount = useMemo(() => {
    const full = headings?.map((h) => h.essence || "").join("\n\n") || "";
    return { words: countWords(full), readTime: estimateReadingTime(countWords(full)) };
  }, [headings]);

  /* ---------- Render ---------- */
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">Create New Article</h1>

      <form className="border border-gray-200 rounded-md" onSubmit={(e) => e.preventDefault()}>
        <CardContent className="space-y-6 p-6">
          {/* Title */}
          <div data-error-id="title" className="space-y-1">
            <label className="flex items-center gap-2">
              <span className="text-red-600">*</span>
              <span className="font-medium">Title</span>
            </label>
            <Input
              placeholder="Article Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                validateField("title", e.target.value);
              }}
              className={formErrors["title"] ? "border-red-500" : ""}
            />
            {formErrors["title"] && <p className="text-red-600 text-sm">{formErrors["title"]}</p>}
          </div>

          {/* Slug (locked) */}
          <div data-error-id="slug" className="space-y-1">
            <label className="flex items-center gap-2">
              <span className="text-red-600">*</span>
              <span className="font-medium">Slug (auto-generated)</span>
            </label>
            <Input
              placeholder="slug-auto-generated"
              value={slug}
              disabled
              onChange={() => {}}
              className={formErrors["slug"] ? "border-red-500 bg-gray-50/80" : "bg-gray-50"}
            />
            {formErrors["slug"] && <p className="text-red-600 text-sm">{formErrors["slug"]}</p>}
            <p className="text-xs text-gray-500">Slug is generated from the title and cannot be edited.</p>
          </div>

          {/* Meta */}
          <div data-error-id="metaDescription" className="space-y-1">
            <label className="flex items-center gap-2">
              <span className="text-red-600">*</span>
              <span className="font-medium">Meta Description (max 160 chars)</span>
            </label>
            <Textarea
              placeholder="Short meta description for SEO"
              value={metaDescription}
              onChange={(e) => {
                setMetaDescription(e.target.value);
                validateField("metaDescription", e.target.value);
              }}
              maxLength={160}
              rows={3}
              className={formErrors["metaDescription"] ? "border-red-500" : ""}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{metaDescription.length}/160</span>
              {formErrors["metaDescription"] && <span className="text-red-600">{formErrors["metaDescription"]}</span>}
            </div>
          </div>

          {/* Keywords / Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-error-id="keywords" className="space-y-1">
              <label className="flex items-center gap-2"><span className="text-red-600">*</span> Keywords (comma separated)</label>
              <Input
                placeholder="eg. nextjs, seo, typescript"
                value={joinForInput(keywords)}
                onChange={(e) => {
                  const arr = parseCommaInput(e.target.value);
                  setKeywords(arr);
                  validateField("keywords", arr);
                }}
                className={formErrors["keywords"] ? "border-red-500" : ""}
              />
              {formErrors["keywords"] && <p className="text-red-600 text-sm">{formErrors["keywords"]}</p>}
            </div>

            <div data-error-id="tags" className="space-y-1">
              <label className="flex items-center gap-2"><span className="text-red-600">*</span> Tags (comma separated)</label>
              <Input
                placeholder="eg. tutorial, how-to"
                value={joinForInput(tags)}
                onChange={(e) => {
                  const arr = parseCommaInput(e.target.value);
                  setTags(arr);
                  validateField("tags", arr);
                }}
                className={formErrors["tags"] ? "border-red-500" : ""}
              />
              {formErrors["tags"] && <p className="text-red-600 text-sm">{formErrors["tags"]}</p>}
            </div>
          </div>

          {/* Author / Cover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-error-id="author" className="space-y-1">
              <label className="flex items-center gap-2"><span className="text-red-600">*</span> Author</label>
              <Input
                placeholder="Author name"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  validateField("author", e.target.value);
                }}
                className={formErrors["author"] ? "border-red-500" : ""}
              />
              {formErrors["author"] && <p className="text-red-600 text-sm">{formErrors["author"]}</p>}
            </div>

            <div data-error-id="coverImage" className="space-y-1">
              <label className="font-medium">Cover Image URL</label>
              <Input placeholder="https://..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
            </div>
          </div>

          {/* Canonical */}
          <div data-error-id="canonicalUrl" className="space-y-1">
            <label className="font-medium">Canonical URL</label>
            <Input
              placeholder="https://example.com/your-article"
              value={canonicalUrl}
              onChange={(e) => {
                setCanonicalUrl(e.target.value);
                validateField("canonicalUrl", e.target.value);
              }}
              className={formErrors["canonicalUrl"] ? "border-red-500" : ""}
            />
            {formErrors["canonicalUrl"] && <p className="text-red-600 text-sm">{formErrors["canonicalUrl"]}</p>}
          </div>

          {/* Internal Links */}
          <div className="space-y-2">
            <h3 className="font-semibold">Internal Links</h3>
            {internalLinks.map((link, i) => (
              <div key={i} data-error-id={`internal_${i}`} className="flex gap-2 items-start">
                <Input value={link} placeholder="Internal URL" onChange={(e) => handleInternalLinkChange(i, e.target.value)} className={formErrors[`internal_${i}`] ? "border-red-500" : ""} />
                <Button variant="ghost" size="icon" type="button" onClick={() => setInternalLinks((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
                {formErrors[`internal_${i}`] && <p className="text-red-600 text-sm">{formErrors[`internal_${i}`]}</p>}
              </div>
            ))}
            <Button variant="outline" onClick={() => setInternalLinks((prev) => [...prev, ""])}><PlusCircle className="w-4 h-4 mr-2" /> Add Internal Link</Button>
          </div>

          {/* External Links */}
          <div className="space-y-2">
            <h3 className="font-semibold">External Links</h3>
            {externalLinks.map((link, i) => (
              <div key={i} data-error-id={`external_${i}`} className="flex gap-2 items-start">
                <Input value={link} placeholder="External URL" onChange={(e) => handleExternalLinkChange(i, e.target.value)} className={formErrors[`external_${i}`] ? "border-red-500" : ""} />
                <Button variant="ghost" size="icon" onClick={() => setExternalLinks(prev => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
                {formErrors[`external_${i}`] && <p className="text-red-600 text-sm">{formErrors[`external_${i}`]}</p>}
              </div>
            ))}
            <Button variant="outline" onClick={() => setExternalLinks((prev) => [...prev, ""])}><PlusCircle className="w-4 h-4 mr-2" /> Add External Link</Button>
          </div>

          {/* Headings / Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold"><span className="text-red-600">*</span> Headings / Sections</h3>
              <div className="flex items-center gap-2">
                <select value={newHeadingType} onChange={(e) => setNewHeadingType(e.target.value as "h2" | "h3")} className="border rounded px-2 py-1">
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                </select>
                <Button variant="outline" onClick={() => setHeadings((prev) => [...prev, { type: newHeadingType, text: "", essence: "", images: [], codeBlocks: [] }])}><PlusCircle className="w-4 h-4 mr-2" /> Add Section</Button>
              </div>
            </div>

            {headings.map((h, i) => (
              <section key={i} className="border p-4 rounded-md space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-24">
                    <select value={h.type} onChange={(e) => { const updated = [...headings]; updated[i].type = e.target.value as "h2" | "h3"; setHeadings(updated); clearFieldError(`heading_${i}_type`); }} className="border rounded px-2 py-1 w-full">
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                    </select>
                  </div>

                  <div className="flex-1" data-error-id={`heading_${i}_text`}>
                    <label className="font-medium flex items-center gap-2"><span className="text-red-600">*</span> Heading Text</label>
                    <Input value={h.text} onChange={(e) => { const updated = [...headings]; updated[i].text = e.target.value; setHeadings(updated); if (!e.target.value.trim()) setFieldError(`heading_${i}_text`, "Heading title required"); else clearFieldError(`heading_${i}_text`); }} placeholder="Heading text" className={formErrors[`heading_${i}_text`] ? "border-red-500" : ""} />
                    {formErrors[`heading_${i}_text`] && <p className="text-red-600 text-sm">{formErrors[`heading_${i}_text`]}</p>}
                  </div>

                  <div>
                    <Button variant="ghost" size="icon" onClick={() => { setHeadings((prev) => prev.filter((_, idx) => idx !== i)); Object.keys(formErrors).forEach((k) => { if (k.startsWith(`heading_${i}_`)) clearFieldError(k); }); }} >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div data-error-id={`heading_${i}_essence`} className={formErrors[`heading_${i}_essence`] ? "border border-red-500 p-2 rounded" : ""}>
                  <label className="font-medium"><span className="text-red-600">*</span> Content</label>
                  <MarkdownEditor value={h.essence} onChange={(value: string) => { const updated = [...headings]; updated[i].essence = value; updated[i].images = extractImagesWithAlt(value); setHeadings(updated); if (!value.trim()) setFieldError(`heading_${i}_essence`, "Content required"); else clearFieldError(`heading_${i}_essence`); }} />
                  {formErrors[`heading_${i}_essence`] && <p className="text-red-600 text-sm mt-1">{formErrors[`heading_${i}_essence`]}</p>}
                </div>

                {/* Code blocks for heading */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Code Blocks</h4>
                  {(h.codeBlocks || []).map((cb, j) => (
                    <div key={j} data-error-id={`heading_${i}_code_${j}`} className="border p-2 rounded space-y-2">
                      <div className="flex items-center gap-2">
                        <select value={cb.language} onChange={(e) => { const updated = [...headings]; updated[i].codeBlocks[j].language = e.target.value as CodeLanguage; setHeadings(updated); }} className="border rounded px-2 py-1">
                          {CODE_LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                        </select>

                        <div className="flex-1">
                          <Textarea value={cb.code} onChange={(e) => { const updated = [...headings]; updated[i].codeBlocks[j].code = e.target.value; setHeadings(updated); if (e.target.value.trim() === "") setFieldError(`heading_${i}_code_${j}`, "Code must not be empty"); else clearFieldError(`heading_${i}_code_${j}`); }} rows={6} placeholder="Paste code here" className={formErrors[`heading_${i}_code_${j}`] ? "border-red-500" : ""} />
                          {formErrors[`heading_${i}_code_${j}`] && <p className="text-red-600 text-sm">{formErrors[`heading_${i}_code_${j}`]}</p>}
                        </div>
                      </div>

                      <Input value={cb.caption || ""} onChange={(e) => { const updated = [...headings]; updated[i].codeBlocks[j].caption = e.target.value; setHeadings(updated); }} placeholder="Caption (optional)" />

                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => { const updated = [...headings]; updated[i].codeBlocks = updated[i].codeBlocks.filter((_, k) => k !== j); setHeadings(updated); clearFieldError(`heading_${i}_code_${j}`); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={() => { const updated = [...headings]; if (!updated[0]) { /* nothing */ } if (!updated) {} if (!updated) {} if (!updated) {} // no-op to keep linter happy; next line adds block
                    const copy = [...headings];
                    copy.push({ type: newHeadingType, text: "", essence: "", images: [], codeBlocks: [] });
                    setHeadings(copy);
                  }}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Code Block
                  </Button>
                </div>
              </section>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold"><span className="text-red-600">*</span> FAQs</h3>
            {faqSchema.map((faq, i) => (
              <div key={i} data-error-id={`faq_${i}_container`} className="border p-3 rounded space-y-2">
                <div data-error-id={`faq_${i}_question`} className="space-y-1">
                  <label className="font-medium"><span className="text-red-600">*</span> Question</label>
                  <Input value={faq.question} onChange={(e) => { const copy = [...faqSchema]; copy[i].question = e.target.value; setFaqSchema(copy); if (!e.target.value.trim()) setFieldError(`faq_${i}_question`, "Question is required"); else clearFieldError(`faq_${i}_question`); }} className={formErrors[`faq_${i}_question`] ? "border-red-500" : ""} placeholder="FAQ Question" />
                  {formErrors[`faq_${i}_question`] && <p className="text-red-600 text-sm">{formErrors[`faq_${i}_question`]}</p>}
                </div>

                <div data-error-id={`faq_${i}_answer`} className="space-y-1">
                  <label className="font-medium"><span className="text-red-600">*</span> Answer</label>
                  <Textarea value={faq.answer} onChange={(e) => { const copy = [...faqSchema]; copy[i].answer = e.target.value; setFaqSchema(copy); if (!e.target.value.trim()) setFieldError(`faq_${i}_answer`, "Answer is required"); else clearFieldError(`faq_${i}_answer`); }} rows={4} className={formErrors[`faq_${i}_answer`] ? "border-red-500" : ""} placeholder="FAQ Answer" />
                  {formErrors[`faq_${i}_answer`] && <p className="text-red-600 text-sm">{formErrors[`faq_${i}_answer`]}</p>}
                </div>

                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => setFaqSchema(prev => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setFaqSchema(prev => [...prev, { question: "", answer: "" }])}><PlusCircle className="w-4 h-4 mr-2" /> Add FAQ</Button>
          </div>

          {/* Open Graph */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Open Graph Metadata</h3>
            <div data-error-id="og_title" className="space-y-1">
              <Input placeholder="OG Title" value={ogMeta.title} onChange={(e) => setOgMeta(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div data-error-id="og_description" className="space-y-1">
              <Textarea placeholder="OG Description" value={ogMeta.description} onChange={(e) => setOgMeta(prev => ({ ...prev, description: e.target.value }))} rows={2} />
            </div>
            <div data-error-id="og_image" className="space-y-1">
              <Input placeholder="OG Image URL" value={ogMeta.image} onChange={(e) => { setOgMeta(prev => ({ ...prev, image: e.target.value })); validateField("og_image", e.target.value); }} className={formErrors["og_image"] ? "border-red-500" : ""} />
              {formErrors["og_image"] && <p className="text-red-600 text-sm">{formErrors["og_image"]}</p>}
            </div>

            <div data-error-id="og_type" className="space-y-2">
              <label className="font-medium">OG Type</label>
              <select value={ogMeta.type || ""} onChange={(e) => { setOgMeta(prev => ({ ...prev, type: e.target.value })); validateField("og_type", e.target.value); if (e.target.value !== "custom") { setCustomOgType(""); clearFieldError("og_custom_type"); } }} className={formErrors["og_type"] ? "border-red-500 w-full rounded px-3 py-2" : "w-full rounded px-3 py-2 border"}>
                <option value="">Select OG Type (required)</option>
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="profile">Profile</option>
                <option value="custom">Other (Custom)</option>
              </select>
              {formErrors["og_type"] && <p className="text-red-600 text-sm">{formErrors["og_type"]}</p>}

              {ogMeta.type === "custom" && (
                <div data-error-id="og_custom_type" className="mt-2">
                  <Input placeholder="Enter custom OG Type" value={customOgType} onChange={(e) => { setCustomOgType(e.target.value); validateField("og_custom_type", e.target.value); }} className={formErrors["og_custom_type"] ? "border-red-500" : ""} />
                  {formErrors["og_custom_type"] && <p className="text-red-600 text-sm">{formErrors["og_custom_type"]}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Twitter */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Twitter Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Twitter Title" value={twitterMeta.title} onChange={(e) => setTwitterMeta(prev => ({ ...prev, title: e.target.value }))} />
              <select value={twitterMeta.cardType} onChange={(e) => setTwitterMeta(prev => ({ ...prev, cardType: e.target.value as any }))} className="w-full border rounded px-3 py-2">
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>

            <div data-error-id="twitter_image" className="mt-2">
              <Input placeholder="Twitter Image URL" value={twitterMeta.image} onChange={(e) => { setTwitterMeta(prev => ({ ...prev, image: e.target.value })); validateField("twitter_image", e.target.value); }} className={formErrors["twitter_image"] ? "border-red-500" : ""} />
              {formErrors["twitter_image"] && <p className="text-red-600 text-sm">{formErrors["twitter_image"]}</p>}
            </div>
          </div>

          {/* Publishing (STRICT - required) */}
          <div className="flex items-center gap-6 flex-wrap">
            <label className={`flex items-center gap-2 ${formErrors["isPublished"] ? "text-red-600" : ""}`} data-error-id="isPublished">
              <input type="checkbox" checked={isPublished} onChange={() => { setIsPublished((v) => { const newV = !v; validateField("isPublished", newV); if (!newV) { clearFieldError("publishedAt"); } else { validateField("publishedAt", publishedAt); } return newV; }); }} />
              <span className="font-medium">Published <span className="text-xs text-gray-500">(required)</span></span>
            </label>
            {formErrors["isPublished"] && <p className="text-red-600 text-sm">{formErrors["isPublished"]}</p>}

            <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(v => !v)} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={isPinned} onChange={() => setIsPinned(v => !v)} /> Pinned</label>

            {isPublished && (
              <div data-error-id="publishedAt" className="flex flex-col">
                <input type="date" value={publishedAt} onChange={(e) => { setPublishedAt(e.target.value); validateField("publishedAt", e.target.value); }} className={`border rounded px-2 py-1 ${formErrors["publishedAt"] ? "border-red-500" : ""}`} />
                {formErrors["publishedAt"] && <p className="text-red-600 text-sm">{formErrors["publishedAt"]}</p>}
              </div>
            )}

            <div className="ml-auto text-sm text-gray-600">
              <div>Live word count: <strong>{liveWordCount.words}</strong></div>
              <div>Est. read time: <strong>{liveWordCount.readTime} min</strong></div>
            </div>
          </div>

          {/* Structured Data */}
          <div data-error-id="structuredData" className="space-y-1">
            <label className="font-medium">Structured Data (JSON-LD)</label>
            <Textarea value={structuredData} onChange={(e) => { setStructuredData(e.target.value); validateField("structuredData", e.target.value); }} placeholder='{"@context":"https://schema.org","@type":"Article",...}' rows={6} className={formErrors["structuredData"] ? "border-red-500" : ""} />
            {structuredDataError && <p className="text-red-600 text-sm">{structuredDataError}</p>}
            {formErrors["structuredData"] && <p className="text-red-600 text-sm">{formErrors["structuredData"]}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center gap-4">
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create Article"}</Button>
            <Button variant="ghost" onClick={() => { if (confirm("Reset the form? This will clear all fields.")) window.location.reload(); }}>Reset</Button>
          </div>
        </CardContent>
      </form>
    </div>
  );
}
