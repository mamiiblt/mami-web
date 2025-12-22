"use client";

import { useTranslation } from "react-i18next";
import { ClientBlogContent } from "./ClientArticleContent";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function ArticlesContent({ posts }) {
  const { t } = useTranslation("articles");
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, []);

  return (
    <div className="container max-w-8xl mx-auto px-4">
      <div className="space-y-8 sm:space-y-12">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 transition-colors">
              {t("noPostsTitle")}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
              {t("noPostsDescription")}
            </p>
          </div>
        ) : (
          <ClientBlogContent
            title={t("allTitle")}
            description={t("allDescription")}
            posts={posts}
          />
        )}
      </div>
    </div>
  );
}
