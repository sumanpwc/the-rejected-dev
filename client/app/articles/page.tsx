// app/articles/page.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchArticles } from "@/lib/api"; // Axios wrapper function
import { ArticleType } from "@/types/ArticleType";
import { ArticlesResponse} from "@/types/ArticlesResponse";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const selectedTag = searchParams.get("tag") || "";

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response: ArticlesResponse = await fetchArticles({
          page: currentPage,
          limit: PAGE_SIZE,
          tag: selectedTag,
        });
        setArticles(response.data);
        setTotal(response.totalItems);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentPage, selectedTag]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePagination = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-slate-800 dark:text-white">All Articles</h1>

      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article) => (
            <li key={article._id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow hover:shadow-md transition">
              <Link href={`/article/${article.slug}`}>
                <h2 className="text-2xl font-semibold text-blue-600 hover:underline">{article.title}</h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{new Date(article.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300 line-clamp-3">
                {article.metaDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/articles?tag=${tag}`)}
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePagination(page)}
              className={`px-4 py-2 rounded-md text-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
