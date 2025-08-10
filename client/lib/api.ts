// lib/api.ts

import axios, { AxiosInstance } from "axios";
import { ArticleType } from "@/types/ArticleType";
//import ArticleModel from "@/types/ArticleType";
import { ArticlesResponse} from "@/types/ArticlesResponse";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create a reusable axios instance with defaults
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Generic error handler (can be extended for logging or Sentry)
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    // Axios error
    const message = error.response?.data?.message || error.message || "API request failed";
    throw new Error(message);
  }
  throw new Error("An unexpected error occurred");
}

// Create article
export async function createArticle(data: any) {
  try {
    const res = await apiClient.post("/articles/create", data);
    return res; // or return res.data if you prefer
  } catch (error) {
    handleApiError(error);
  }
}

// fetch Articles
export async function fetchArticles({
  page = 1,
  limit = 6,
  tag = "",
  search = "",
  sort = "publishedAt-desc",
  isPublished,
}: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  sort?: string;
  isPublished?: boolean;
}): Promise<ArticlesResponse> {
  try {
    const { data } = await apiClient.get<ArticlesResponse>("/articles", {
      params: {
        page,
        limit,
        tag: tag || undefined,
        search: search || undefined,
        sort,
        isPublished,
      },
    });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/*
export async function fetchArticles({
  page = 1,
  limit = 6,
  tag = "",
  search = "",
}: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string
}): Promise<ArticlesResponse> {
  try {
    const { data } = await apiClient.get<ArticlesResponse>("/articles", {
      params: { page, limit, tag: tag, search: search || undefined },
    });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
*/
export async function getArticleBySlug(slug: string): Promise<ArticleType | null> {
  try {
    const { data } = await apiClient.get<ArticleType>(`/articles/${slug}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Explicit 404 handling
    }
    handleApiError(error);
  }
}

export async function deleteArticleById(id: string): Promise<void> {
  try {
    await apiClient.delete(`/articles/delete/${id}`);
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await apiClient.delete(`/articles/delete/${id}`);
  } catch (error) {
    handleApiError(error);
  }
}