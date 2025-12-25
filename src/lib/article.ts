import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export function getLocalizedArticlesDir(localeCode: string) {
  var lc = "en";
  if (localeCode == "tr") {
    lc = "tr"
  }
  return path.join(process.cwd(), "public", "articles", lc);
}

export interface Article {
  article_id: number;
  slug: string;
  locale: string;
  title: string;
  date: string;
  description: string;
  content: string;
  topic: string;
  readingTime: number;
  banner: string;
}

interface FrontMatter {
  article_id: number;
  title: string;
  date: string;
  description: string;
  banner: string;
  topic: string;
  seoKeywords: string[];
}

export async function getAllArticlePosts(localeCode): Promise<Article[]> {
  try {
    try {
      await fs.access(getLocalizedArticlesDir(localeCode));
    } catch {
      await fs.mkdir(getLocalizedArticlesDir(localeCode), { recursive: true });
      console.log(`Created articles directory: ${getLocalizedArticlesDir(localeCode)}`);
    }

    const files = await fs.readdir(getLocalizedArticlesDir(localeCode));

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(getLocalizedArticlesDir(localeCode), file);
          const source = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(source);

          return {
            ...data,
            content,
            locale: localeCode,
            slug: file.replace(".md", ""),
            readingTime: calculateReadingTimeMin(content),
            topic: data.topic,
          } as Article;
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

interface SeoProperties {
  title: string,
  desc: string,
  banner: string,
  publishDateISO: string,
  topic: string,
  seoKeywords: string[]
}

export async function getArticleSeoPropsBySlug(slug: string, localeCode: string): Promise<SeoProperties | null> {
  try {
    const source = await fs.readFile(
        path.join(getLocalizedArticlesDir(localeCode), `${slug}.md`),
        "utf8"
    );

    const { data } = matter(source) as unknown as {
      data: FrontMatter;
    };

    return {
      title: data.title,
      desc: data.description,
      banner: data.banner,
      publishDateISO: convertDateToStr(data.date).toISOString(),
      topic: data.topic,
      seoKeywords: data.seoKeywords
    }
  } catch (error) {
    return null;
  }
}

export async function getArticleSEO(slug: string, locale: string): Promise<SeoProperties | null> {
  const post = await getArticleSeoPropsBySlug(slug, locale)

  if (post != null) {
    return post
  } else {
    return null
  }
}

export async function getArticleBySlug(slug: string, localeCode: string): Promise<Article | null> {
  try {
    const source = await fs.readFile(
      path.join(getLocalizedArticlesDir(localeCode), `${slug}.md`),
      "utf8"
    );
    const { data, content } = matter(source) as unknown as {
      data: FrontMatter;
      content: string;
    };

    const readingTime = calculateReadingTimeMin(content);

    return {
      ...data,
      locale: localeCode,
      content: content,
      slug,
      readingTime,
      topic: data.topic,
    } as Article;
  } catch (error) {
    return null;
  }
}

function calculateReadingTimeMin(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}




function convertDateToStr(dateText: string): Date {
  const [day, month, year] = dateText.split(".").map(Number);
  return new Date(year, month - 1, day);
}

