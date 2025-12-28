import React from "react";
import {getBannerUrl} from "@/lib/utils";
import {pgPool} from "@/lib/serverDatabase";

export const revalidate = 3600;

async function getArticleSEOData(articleId: string, locale: string) {
  const supportedLocales = ["en", "tr"]
  if (!supportedLocales.includes(locale)) {
    return null
  }

  const response = await pgPool.query(`
        SELECT 
            title_${locale} AS tt,
            desc_${locale} AS dc,
            date AS dt,
            topic AS tp,
            id_a::integer AS id_a
        FROM mami_articles WHERE id = $1
        LIMIT 1
    `, [articleId])

  if (response.rows.length == 0) {
    return null;
  }

  return response.rows[0]
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const seo = await getArticleSEOData(slug, locale)
  if (seo == null) return { title: "Not found", robots: { index: false } };
  const banner = getBannerUrl(seo.id_a)

  const baseUrl = "https://mamii.dev";
  const pageUrl = `${baseUrl}/article/${locale}/${slug}`;

  return {
    title: seo.tt,
    description: seo.dc,
    authors: [{ name: 'mamiiblt', url: 'https://mamii.dev/about' }],
    alternates: {
      canonical: pageUrl,
      languages: {
        'en-US': `${baseUrl}/article/en/${slug}`,
        'tr-TR': `${baseUrl}/article/tr/${slug}`,
      }
    },
    openGraph: {
      title: seo.tt,
      description: seo.dc,
      url: pageUrl,
      type: "article",
      siteName: "mamii's articles",
      publishedTime: seo.dt,
      authors: ["M. Ali BULUT"],
      section: seo.tp,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: banner
          ? [{ url: banner, width: 1200, height: 630, alt: seo.tt, type: "image/png" }]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@mamiiblt",
      title: seo.tt,
      creator: "@mamiiblt",
      label1: "Written by",
      data1: "M. Ali BULUT",
      description: seo.dc ,
      images: banner ? [banner] : undefined,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary-foreground dark:bg-primary-background">
      {children}
    </div>
  );
}
