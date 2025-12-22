import { MetadataRoute } from "next"
import {getAllArticlePosts} from "@/lib/article";

const baseUrl = "https://mamii.me"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const regularRoutes = ["/", "/articles", "/projects", "/about"].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: route === "/" ? 1 : 0.8,
        })
    );

    const articles = await getAllArticlePosts("tr")
    const articleRoutes = articles.map(article => ({
        url: `${baseUrl}/article/en/${article.slug}`,

        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,

        alternates: {
            languages: {
                tr: `${baseUrl}/article/tr/${article.slug}`,
                en: `${baseUrl}/article/en/${article.slug}`,
            },
        },
    }))


    return [...regularRoutes, ...articleRoutes]
}
