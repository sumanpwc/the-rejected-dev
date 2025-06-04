// types/ArticlesResponse.ts

import type { ArticleType } from './ArticleType';

export interface ArticlesResponse {
  data: ArticleType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
