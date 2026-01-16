import { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";

const seoData = {
  title: "mamii's articles",
  description: "You can access all of mamii's articles through this page.",
  bannerUrl: "/page_banners/articles.png"
}

export const metadata: Metadata = {
  ...defaultMetadata,
  title: seoData.title,
  description: seoData.description,
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    locale: "en_US",
    images: [
      { url: seoData.bannerUrl, width: 1024, height: 558, alt: seoData.title, type: "image/png" },
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@mamiiblt",
    title: seoData.title,
    creator: "@mamiiblt",
    description: seoData.description,
    images: [seoData.bannerUrl]
  }
};

export default function ArticlesLayout({
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
