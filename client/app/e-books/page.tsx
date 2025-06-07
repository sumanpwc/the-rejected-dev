"use client";

import React, { useState, useEffect } from "react";
import EBookCard from "@/components/card/EBookCard";
import { Dialog } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
    coverImageUrl: "/ebooks/covers/ml-basics.jpg",
  },
  {
    id: "dl-advanced",
    title: "Deep Learning Advanced",
    author: "Michael Lee",
    description: "A comprehensive guide to deep learning architectures and techniques.",
    tags: ["AI", "Deep Learning"],
    pdfUrl: "/ebooks/dl-advanced.pdf",
    coverImageUrl: "/ebooks/covers/dl-advanced.jpg",
  },
  // Add more EBooks here
  
];

const TAGS = ["All", "Java", "DevOps", "AI", "Programming", "Docker", "Machine Learning"];
const BOOKS_PER_PAGE = 6;

export default function EBooksPage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [filteredBooks, setFilteredBooks] = useState<EBook[]>(EBOOKS);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Load download counts from localStorage on mount
  useEffect(() => {
    const savedCounts = localStorage.getItem("ebook-download-counts");
    if (savedCounts) {
      setDownloadCounts(JSON.parse(savedCounts));
    }
  }, []);

  // Save download counts to localStorage
  useEffect(() => {
    localStorage.setItem("ebook-download-counts", JSON.stringify(downloadCounts));
  }, [downloadCounts]);

  useEffect(() => {
    const filtered = selectedTag === "All"
      ? EBOOKS
      : EBOOKS.filter((book) => book.tags.includes(selectedTag));
    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to page 1 on tag change
  }, [selectedTag]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

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
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
        E-Books <span className="text-yellow-400 font-mono">Library</span>
      </h1>

      {/* Tag Filter */}
      <nav className="mb-4 flex flex-wrap gap-3">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              selectedTag === tag
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </nav>

      {/* Total Count */}
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Showing {filteredBooks.length} e-books for{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedTag}</span>
      </p>

      {/* EBook Cards Grid with Animation */}
      <AnimatePresence mode="wait">
        {paginatedBooks.length > 0 ? (
          <motion.section
            key={currentPage + selectedTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedBooks.map((book) => (
              <div key={book.id} className="relative">
                <EBookCard
                  {...book}
                  onPreview={openPreview}
                  onDownload={handleDownload}
                />
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
          </motion.section>
        ) : (
          <motion.p
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-slate-600 dark:text-slate-400 text-lg mt-16"
          >
            No e-books found for "{selectedTag}".
          </motion.p>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* PDF Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={closePreview}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background bg-opacity-70"
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
