import { MetadataRoute } from "next"
import {pgPool} from "@/lib/serverDatabase";

const baseUrl = "https://mamii.dev"

async function getArticleSlugs() {
    const response = await pgPool.query(`SELECT id FROM mami_articles`)
    return response.rows.map(item => item.id);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const regularRoutes = ["/", "/articles", "/projects", "/about"].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: route === "/" ? 1 : 0.8,
        })
    );

    const slugs = await getArticleSlugs()
    const articleRoutes = slugs.map(slug => ({
        url: `${baseUrl}/article/en/${slug}`,

        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,

        alternates: {
            languages: {
                tr: `${baseUrl}/article/tr/${slug}`,
                en: `${baseUrl}/article/en/${slug}`,
            },
        },
    }))


    return [...regularRoutes, ...articleRoutes]
}
