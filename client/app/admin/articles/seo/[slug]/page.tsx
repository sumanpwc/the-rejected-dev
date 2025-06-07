// app/admin/articles/seo/[slug]/page.tsx

import { getArticleBySlug } from "@/lib/api"; // Adjust based on your system
import { getSEOHealth } from "@/lib/seoHealth";
import { Badge } from "@/components/ui/badge/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";

interface SEOPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: SEOPageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `SEO Audit – ${slug}`,
    };
}

export default async function SEOStatusPage({ params }: SEOPageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) return notFound();

    const seo = getSEOHealth(article);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-2xl font-bold">SEO Audit Report</h1>

        <Card>
            <CardHeader>
            <CardTitle className="text-xl">{article.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge
                className={`text-sm ${
                    seo.seoScore >= 80
                    ? "bg-green-500 text-green-700"
                    : seo.seoScore >= 60
                    ? "bg-yellow-500 text-yellow-700"
                    : "bg-red-500 text-red-700"
                }`}
                >
                SEO Score: {seo.seoScore}
                </Badge>
                <Badge variant="default">{seo.wordCount} words</Badge>
                <Badge variant="outline">
                Last updated {formatDistanceToNow(new Date(article.updatedAt))} ago
                </Badge>
                <Badge variant={article.isPublished ? "default" : "green"}>
                {article.isPublished ? "Published" : "Draft"}
                </Badge>
            </div>
            </CardHeader>

            <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">Issues Detected</h2>

            {seo.missingFields.length === 0 ? (
                <p className="text-green-600">✅ No major SEO issues found.</p>
            ) : (
                <ul className="list-disc pl-5 text-sm text-red-700">
                {seo.missingFields.map((field) => (
                    <li key={field}>{field}</li>
                ))}
                </ul>
            )}

            {seo.suggestions.length > 0 && (
                <>
                <h2 className="text-lg font-semibold">Suggestions</h2>
                <ul className="list-disc pl-5 text-sm text-gray-800">
                    {seo.suggestions.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                    ))}
                </ul>
                </>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <Link href={`/article/${article.slug}`} target="_blank">
                <Button variant="outline">Download</Button>
                </Link>
                <Link href={`/admin/articles/edit/${article.slug}`}>
                <Button variant="default">Fix Now</Button>
                </Link>
                <Link href={`/article/${article.slug}`} target="_blank">
                <Button variant="outline">View Live</Button>
                </Link>
            </div>
            </CardContent>
        </Card>
        </div>
    );
}
