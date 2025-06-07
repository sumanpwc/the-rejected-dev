"use client";

import { useEffect, useState } from "react";
import { fetchArticles, deleteArticle } from "@/lib/api";
import { ArticleType } from "@/types/ArticleType";
import { ArticlesResponse } from "@/types/ArticlesResponse";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSEOHealth } from "@/lib/seoHealth";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PAGE_SIZE = 6;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Add states
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortOrder, setSortOrder] = useState<"publishedAt-desc" | "publishedAt-asc" | "updatedAt-desc">("publishedAt-desc");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Replace fetchData
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ArticlesResponse = await fetchArticles({
        page,
        limit: PAGE_SIZE,
        search,
        sort: sortOrder,
        tag: activeTag || "",
        isPublished:
          statusFilter === "all"
            ? undefined
            : statusFilter === "published"
            ? true
            : false,
      });

      setArticles(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  };

  // Add to useEffect deps
  useEffect(() => {
    fetchData();
  }, [page, search, sortOrder, statusFilter, activeTag]);

  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      await deleteArticle(confirmId);
      toast.success("Article deleted");
      await fetchData();
    } catch (error) {
      toast.error("Failed to delete article.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-blue-950 font-bold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button>Create New Article</Button>
        </Link>
      </div>

      <div className="flex items-center gap-25">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md"
        />
        <span className="text-sm text-muted-foreground">
          Total: {totalItems}
        </span>
      

        <div className="flex flex-wrap items-center gap-20">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium">Status:</label>
            <select
              className="ml-2 border rounded-md px-2 py-1 text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "published" | "draft")
              }
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium">Sort:</label>
            <select
              className="ml-2 border rounded-md px-2 py-1 text-sm"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(
                  e.target.value as
                    | "publishedAt-desc"
                    | "publishedAt-asc"
                    | "updatedAt-desc"
                )
              }
            >
              <option value="publishedAt-desc">Newest</option>
              <option value="publishedAt-asc">Oldest</option>
              <option value="updatedAt-desc">Recently Updated</option>
            </select>
          </div>

          {/* Active Tag Filter */}
          {activeTag && (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Filtered by tag:
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {activeTag}
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setActiveTag(null);
                  setPage(1);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles found.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 sm:p-1">
        {articles.map((article) => {
          const health = getSEOHealth(article);
          const isDeleting = deletingId === article._id;

          return (
            <Card key={article._id} className="relative">
              <CardContent className="p-5 space-y-3">
                {/* ✅ Title */}
                <h2 className="text-lg font-semibold line-clamp-2">
                  {article.title}
                </h2>

                {/* ✅ SEO Health Badges with Tooltip */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    title="Overall SEO score based on structure and metadata"
                    className={`px-2 py-1 rounded-full font-medium ${
                      health.seoScore >= 80
                        ? "bg-green-100 text-green-600"
                        : health.seoScore >= 60
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    SEO Score: {health.seoScore}
                  </span>
                  <span
                    title="Word count of the article content"
                    className="bg-gray-100 text-stone-700 px-2 py-1 rounded-full"
                  >
                   Word Count: {health.wordCount} 
                  </span>

                  <Button variant="outline" size="xs">
                    <Link href={`/admin/articles/seo/${article.slug}`}>Check SEO Status</Link>
                  </Button>
                </div>

                {/* ✅ Meta description preview */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.metaDescription}
                </p>

                {/* ✅ Status + Action Buttons */}
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      article.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {article.isPublished ? "Published" : "Draft"}
                  </span>

                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <Link href={`/admin/articles/edit/${article.slug}`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting}
                        title="Edit Article"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    {/* Delete Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isDeleting}
                          title="Delete Article"
                          onClick={() => setConfirmId(article._id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Confirm deletion of "{article.title}"?
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground">
                          This action is irreversible.
                        </div>
                        <DialogFooter className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setConfirmId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* ✅ Tag filter buttons */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {article.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTag(tag);
                        setPage(1);
                      }}
                      className={`text-xs px-2 py-1 rounded-full transition ${
                        tag === activeTag
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            ← Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
