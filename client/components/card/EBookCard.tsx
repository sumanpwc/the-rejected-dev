"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge/Badge";
import { motion } from "framer-motion";
import { FiDownload, FiBookmark, FiBookmark as FiBookmarkFilled, FiEye } from "react-icons/fi";

type EBookCardProps = {
  id: string;
  title: string;
  author: string;
  description: string;
  tags?: string[];
  pdfUrl: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  onPreview: (pdfUrl: string, title: string) => void;
  onDownload: (id: string) => void;
};

export default function EBookCard({
  id,
  title,
  author,
  description,
  tags = [],
  pdfUrl,
  coverImageUrl,
  coverImageAlt,
  onPreview,
  onDownload,
}: EBookCardProps) {
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`ebook-bookmark-${id}`) === "true";
    }
    return false;
  });

  // Toggle bookmark in localStorage
  function toggleBookmark() {
    const newVal = !bookmarked;
    setBookmarked(newVal);
    if (typeof window !== "undefined") {
      localStorage.setItem(`ebook-bookmark-${id}`, newVal.toString());
    }
  }

  return (
    <motion.article
      className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      role="article"
      aria-labelledby={`${id}-title`}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
    >
      {/* Cover Image or Placeholder */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={coverImageAlt ?? `Cover image for ${title}`}
            className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-lg select-none">No Cover Image</div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3
          id={`${id}-title`}
          className="text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2"
        >
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-medium">By {author}</p>
        <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-3 flex-grow">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4" aria-label="E-book tags">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white cursor-default transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => onPreview(pdfUrl, title)}
            aria-label={`Preview PDF of ${title}`}
            className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
          >
            <FiEye size={18} /> Preview
          </button>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                toggleBookmark();
              }}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? `Remove bookmark from ${title}` : `Bookmark ${title}`}
              className="text-slate-700 dark:text-slate-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              {bookmarked ? <FiBookmark size={20} /> : <FiBookmarkFilled size={20} style={{ fill: "none", strokeWidth: 2 }} />}
            </button>

            <a
              href={pdfUrl}
              download
              onClick={() => onDownload(id)}
              aria-label={`Download PDF of ${title}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiDownload size={18} /> Download
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
