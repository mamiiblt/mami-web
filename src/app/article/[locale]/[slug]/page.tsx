import {extractHeadings, getArticleBySlug, getArticleSEO} from "@/lib/article";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticlePostContent from "@/app/article/[locale]/[slug]/ArticlePostContent";

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  const { slug, locale } = await params;

  const seo = await getArticleSEO(slug, locale);

  if (!seo) {
    return {
      title: "Article not found",
      robots: { index: false },
    };
  }

  const baseUrl = "https://mamii.me";

  return {
    title: seo.title,
    description: seo.description,

    alternates: {
      canonical: `${baseUrl}/article/${slug}`,
      languages: {
        en: `${baseUrl}/en/article/${slug}`,
        tr: `${baseUrl}/tr/article/${slug}`,
      },
    },

    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
      type: "article",
      locale,
      url: `${baseUrl}/${locale}/article/${slug}`,
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
  };
}
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getArticleBySlug(slug, locale);

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col bg-background dark:bg-dark-background items-center justify-center">
        <div className="container max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-lg mx-auto">
            The article post you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
          <Button
            asChild
            className="transition-all duration-300 hover:scale-105 px-6 py-2"
          >
            <Link href="/blogs" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const headings = extractHeadings(post.content);

  return (
      <ArticlePostContent post={post} headings={headings} />
  );
}
