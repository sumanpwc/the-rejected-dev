"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { FileText } from "lucide-react";
import ArticleCard from "@/components/card/ArticleCard";
import { format } from "date-fns";

type ArticleSummary = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
  imageUrl?: string;
};

const allArticles: ArticleSummary[] = [
    {
    slug: "java-microservices-best-practices",
    title: "Java Microservices Best Practices for Scalable Architecture",
    summary:
      "Explore how to build robust microservices using Java, Spring Boot, and Docker with real-world architecture insights.",
    date: "2025-05-25",
    tags: ["Java", "Microservices", "Spring Boot"],
  },
  {
    slug: "ai-usecases-cloud-security",
    title: "Top AI Use Cases in Cloud Security",
    summary:
      "How AI is transforming cloud security—from anomaly detection to automated incident response.",
    date: "2025-05-22",
    tags: ["AI/ML", "Security", "Cloud"],
  },
  {
    slug: "devops-monitoring-cloudwatch",
    title: "Real-time DevOps Monitoring with AWS CloudWatch",
    summary:
      "Learn how to integrate CloudWatch dashboards and alerts into your DevOps pipelines effectively.",
    date: "2025-05-20",
    tags: ["DevOps", "AWS", "Monitoring"],
  },
  {
    slug: "building-scalable-rest-apis",
    title: "Building Scalable REST APIs with Spring Boot",
    summary:
      "Step-by-step guide to designing RESTful APIs in Spring Boot that scale effortlessly under load.",
    date: "2025-05-18",
    tags: ["Java", "Spring Boot", "API"],
  },
  {
    slug: "kafka-streams-intro",
    title: "Introduction to Kafka Streams for Real-time Data Processing",
    summary:
      "Understand how Kafka Streams enable real-time data processing with fault tolerance and scalability.",
    date: "2025-05-15",
    tags: ["Kafka", "Streaming", "Data Processing"],
  },
  {
    slug: "effective-docker-compose-setup",
    title: "Effective Docker Compose Setup for Microservices",
    summary:
      "Learn to orchestrate your microservices environment efficiently with Docker Compose configurations.",
    date: "2025-05-12",
    tags: ["Docker", "Microservices", "DevOps"],
  },
  {
    slug: "cloud-security-best-practices",
    title: "Cloud Security Best Practices for Enterprises",
    summary:
      "Discover essential security controls and strategies for protecting cloud infrastructure at scale.",
    date: "2025-05-10",
    tags: ["Cloud", "Security", "Enterprise"],
  },
  {
    slug: "ci-cd-pipelines-with-jenkins",
    title: "Implementing CI/CD Pipelines with Jenkins",
    summary:
      "Automate your software delivery with Jenkins pipelines for faster and safer releases.",
    date: "2025-05-08",
    tags: ["DevOps", "Jenkins", "CI/CD"],
  },
  {
    slug: "introduction-to-mlops",
    title: "Introduction to MLOps: Bridging ML and DevOps",
    summary:
      "Explore how MLOps practices streamline machine learning model deployment and monitoring.",
    date: "2025-05-05",
    tags: ["AI/ML", "DevOps", "MLOps"],
  },
  {
    slug: "nextjs-performance-optimization",
    title: "Next.js Performance Optimization Techniques",
    summary:
      "Improve your Next.js apps with best practices for faster loading and better user experience.",
    date: "2025-05-01",
    tags: ["Next.js", "Performance", "Frontend"],
  },// You can add more articles here to see pagination in action
];

const PAGE_SIZE = 3;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setArticles(allArticles);
      setLoading(false);
    }, 400);
  }, []);

  const allTags = Array.from(
    new Set(allArticles.flatMap((article) => article.tags ?? []))
  );

  const filteredArticles = selectedTag
    ? articles.filter((article) =>
        article.tags?.includes(selectedTag)
      )
    : articles;

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    setCurrentPage(1);
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-400">
        Loading articles...
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Insightful Articles | TheRejected.Dev</title>
        <meta name="description" content="Stay updated with technical insights, use cases, and real-world breakdowns on Java, Cloud, Security, and AI topics." />
        <meta property="og:title" content="Insightful Articles | TheRejected.Dev" />
        <meta property="og:description" content="Stay updated with technical insights, use cases, and real-world breakdowns on Java, Cloud, Security, and AI topics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://therejected.dev/articles" />
        <meta property="og:image" content="https://therejected.dev/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Insightful Articles | TheRejected.Dev" />
        <meta name="twitter:description" content="Stay updated with technical insights, use cases, and real-world breakdowns on Java, Cloud, Security, and AI topics." />
        <meta name="twitter:image" content="https://therejected.dev/og-image.png" />
      </Head>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="text-center mb-14">
          <div className="flex justify-center gap-3 text-green-500 dark:text-green-400 mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-yellow-400 tracking-tight">
            Insightful <span className="text-yellow-400 font-mono">Articles</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Stay updated with technical insights, use cases, and real-world breakdowns on Java, Cloud, Security, and AI topics.
          </p>
        </section>

        {/* Tag Filters */}
        <section className="flex flex-wrap justify-center gap-3 mb-10">
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-green-500 hover:text-white"
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </section>

        {/* Articles */}
        {filteredArticles.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-400" role="alert">
            No articles found for <strong>{selectedTag}</strong>.
          </p>
        ) : (
          <>
            <section
              aria-label="List of technical articles"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedArticles.map((article) => {
                const formattedDate = format(new Date(article.date), "MMM d, yyyy");
                return (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    slug={article.slug}
                    description={article.summary}
                    date={formattedDate}
                    readTime="—"
                    tags={article.tags}
                    imageUrl={article.imageUrl}
                  />
                );
              })}
            </section>

            {/* Pagination */}
            <nav className="flex justify-center mt-12 space-x-3" aria-label="Pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-semibold transition
                  ${currentPage === 1
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"}
                `}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-4 py-2 rounded-md font-semibold transition
                      ${isActive
                        ? "bg-blue-700 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 hover:bg-blue-600 hover:text-white"}
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-semibold transition
                  ${currentPage === totalPages
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"}
                `}
              >
                Next
              </button>
            </nav>
          </>
        )}
      </main>
    </>
  );
}
