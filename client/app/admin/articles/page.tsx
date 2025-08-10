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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortOrder, setSortOrder] = useState<"publishedAt-desc" | "publishedAt-asc" | "updatedAt-desc">("publishedAt-desc");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
    } catch {
      toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  };

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
    } catch {
      toast.error("Failed to delete article.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-blue-950 font-bold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button>Create New Article</Button>
        </Link>
      </div>

      {/* Filters / Search - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          
          {/* Search Input */}
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 min-w-[200px] max-w-sm"
          />

          {/* Total Count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Total: {totalItems}
          </span>

          {/* Status Filter */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label className="text-sm font-medium">Status:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Sort Filter */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label className="text-sm font-medium">Sort:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {articles.map((article) => {
            const health = getSEOHealth(article);
            const isDeleting = deletingId === article._id;

            return (
              <Card key={article._id} className="relative">
                <CardContent className="p-5 space-y-3">
                  {/* Title */}
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {article.title}
                  </h2>

                  {/* SEO Health Badges */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      title="Overall SEO score"
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
                      title="Word count"
                      className="bg-gray-100 text-stone-700 px-2 py-1 rounded-full"
                    >
                      Word Count: {health.wordCount}
                    </span>

                    <Button variant="outline" size="xs">
                      <Link href={`/admin/articles/seo/${article.slug}`}>
                        Check SEO Status
                      </Link>
                    </Button>
                  </div>

                  {/* Meta description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.metaDescription}
                  </p>

                  {/* Status + Actions */}
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
                      <Dialog
                        open={isDialogOpen && confirmId === article._id}
                        onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) setConfirmId(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isDeleting}
                            title="Delete Article"
                            onClick={() => {
                              setConfirmId(article._id);
                              setIsDialogOpen(true);
                            }}
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
                              onClick={() => {
                                setConfirmId(null);
                                setIsDialogOpen(false);
                              }}
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700"
                      >
                        {tag}
                      </span>
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
