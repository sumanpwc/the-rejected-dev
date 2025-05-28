"use client";

import React, { useState, useEffect } from "react";
import EBookCard from "@/components/card/EBookCard";
import { Dialog } from "@headlessui/react";
import { FiX } from "react-icons/fi";

type EBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  pdfUrl: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
};

const EBOOKS: EBook[] = [
  {
    id: "java-101",
    title: "Java Mastery",
    author: "John Doe",
    description: "A comprehensive guide to mastering Java programming.",
    tags: ["Java", "Programming"],
    pdfUrl: "/ebooks/java-mastery.pdf",
    coverImageUrl: "/ebooks/covers/java-mastery.jpg",
  },
  {
    id: "docker-guide",
    title: "Docker Essentials",
    author: "Jane Smith",
    description: "Learn Docker fundamentals and how to use containers effectively.",
    tags: ["DevOps", "Docker"],
    pdfUrl: "/ebooks/docker-essentials.pdf",
    coverImageUrl: "/ebooks/covers/docker-essentials.jpg",
  },
  {
    id: "ml-intro",
    title: "Machine Learning Basics",
    author: "Alice Johnson",
    description: "An introductory book on machine learning concepts and algorithms.",
    tags: ["AI", "Machine Learning"],
    pdfUrl: "/ebooks/ml-basics.pdf",
    coverImageUrl: "/ebooks/covers/ml-basics.jpg"
  },
  {
    id: "dl-advanced",
    title: "Deep Learning Advanced",
    author: "Michael Lee",
    description: "A comprehensive guide to deep learning architectures and techniques.",
    tags: ["AI", "Deep Learning"],
    pdfUrl: "/ebooks/dl-advanced.pdf",
    coverImageUrl: "/ebooks/covers/dl-advanced.jpg"
  },
  // Add more as needed
];

const TAGS = ["All", "Java", "DevOps", "AI", "Programming", "Docker", "Machine Learning"];

export default function EBooksPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [filteredBooks, setFilteredBooks] = useState<EBook[]>(EBOOKS);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  // Load download counts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCounts = localStorage.getItem("ebook-download-counts");
      if (savedCounts) {
        setDownloadCounts(JSON.parse(savedCounts));
      }
    }
  }, []);

  // Save download counts on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ebook-download-counts", JSON.stringify(downloadCounts));
    }
  }, [downloadCounts]);

  useEffect(() => {
    if (selectedTag === "All") {
      setFilteredBooks(EBOOKS);
    } else {
      setFilteredBooks(EBOOKS.filter((book) => book.tags.includes(selectedTag)));
    }
  }, [selectedTag]);

  function openPreview(pdfUrl: string, title: string) {
    setPreviewPdfUrl(pdfUrl);
    setPreviewTitle(title);
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
    setPreviewPdfUrl("");
    setPreviewTitle("");
  }

  function handleDownload(id: string) {
    setDownloadCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        E-Books
        <span className="text-yellow-400 font-mono"> Library</span> 
      </h1>

      {/* Tag Filter */}
      <nav
        aria-label="Filter e-books by technology tags"
        className="mb-8 flex flex-wrap gap-3"
      >
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors
              ${
                selectedTag === tag
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white"
              }`}
            aria-pressed={selectedTag === tag}
          >
            {tag}
          </button>
        ))}
      </nav>

      {/* EBook Cards Grid */}
      {filteredBooks.length > 0 ? (
        <section
          aria-live="polite"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredBooks.map((book) => (
            <div key={book.id} className="relative">
              <EBookCard
                {...book}
                onPreview={openPreview}
                onDownload={handleDownload}
              />
              {/* Download count badge */}
              {downloadCounts[book.id] && (
                <span
                  aria-label={`${downloadCounts[book.id]} downloads`}
                  className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 select-none shadow-md"
                >
                  {downloadCounts[book.id]}
                </span>
              )}
            </div>
          ))}
        </section>
      ) : (
        <p className="text-center text-slate-600 dark:text-slate-400 text-lg mt-16">
          No e-books found for "{selectedTag}".
        </p>
      )}

      {/* PDF Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={closePreview}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
        aria-label={`Preview PDF of ${previewTitle}`}
      >
        <Dialog.Panel className="relative bg-white dark:bg-slate-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-lg overflow-hidden">
          <button
            onClick={closePreview}
            aria-label="Close preview"
            className="absolute top-3 right-3 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <FiX size={28} />
          </button>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white p-4 border-b border-slate-300 dark:border-slate-700">
            Preview: {previewTitle}
          </h2>

          <iframe
            src={previewPdfUrl}
            className="flex-grow w-full border-none"
            title={`PDF preview for ${previewTitle}`}
          />
        </Dialog.Panel>
      </Dialog>
    </main>
  );
}
