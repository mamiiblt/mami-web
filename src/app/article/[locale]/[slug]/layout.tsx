import React from "react";
import {getArticleSEO} from "@/lib/article";

function getFileTypeFromName(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return "unknown";
  return {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  }[ext] || "unknown";
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const seo = await getArticleSEO(slug, locale);
  if (!seo) return { title: "Not found", robots: { index: false } };

  const baseUrl = "https://mamii.me";
  const pageUrl = `${baseUrl}/${locale}/article/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: pageUrl,
      type: "article",
      publishedTime: seo.publishDateISO,
      authors: ["M. Ali BULUT"],
      section: seo.topic,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: seo.image
          ? [{ url: seo.image, width: 1200, height: 630, alt: seo.title, type: getFileTypeFromName(seo.image) }]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@mamiiblt",
      title: seo.title,
      creator: "@mamiiblt",
      label1: "Written by",
      data1: "M. Ali BULUT",
      description: seo.description,
      images: seo.image ? [seo.image] : undefined,
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
