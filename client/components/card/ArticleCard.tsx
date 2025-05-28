// client/components/ArticleCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge/Badge";
import { motion } from "framer-motion";
import { useId } from "react";

type ArticleCardProps = {
  title: string;
  slug: string;
  description: string;
  date: string | Date;
  readTime: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export default function ArticleCard({
  title,
  slug,
  description,
  date,
  readTime,
  tags = [],
  imageUrl,
  imageAlt,
}: ArticleCardProps) {
  const id = useId();

  // Format date nicely if Date object or string
  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

  return (
    <motion.article
      role="article"
      aria-labelledby={`${id}-title`}
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <Link
        href={`/blog/${slug}`}
        className="relative block h-48 sm:h-56 w-full overflow-hidden rounded-t-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label={`Read article: ${title}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? `Article thumbnail for ${title}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="bg-slate-300 dark:bg-slate-700 w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-400 text-lg">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-grow p-6">
        <h2
          id={`${id}-title`}
          className="text-xl font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2"
        >
          <Link href={`/blog/${slug}`} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h2>

        <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 flex-grow">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4" aria-label="Article tags">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white cursor-default transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <footer className="text-sm text-slate-500 dark:text-slate-400 select-none" aria-label="Article date and reading time">
          <time dateTime={new Date(date).toISOString()}>{formattedDate}</time> • {readTime}
        </footer>
      </div>
    </motion.article>
  );
}
