import ArticlePostContent from "@/app/article/[locale]/[slug]/ArticlePostContent";

export default async function ArticleListPage({params}: {
    params: Promise<{ locale: string, slug: string }>;
}) {
    const { slug, locale } = await params;

    return (
        <ArticlePostContent slug={slug} locale={locale} />
    );
}
