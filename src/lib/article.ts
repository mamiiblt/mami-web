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
  title: string;
  date: string;
  description: string;
  banner: string;
  topic: string;
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
  banner: string
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


    console.log(data)


    return {
      title: data.title,
      desc: data.description,
      banner: data.banner
    }
  } catch (error) {
    return null;
  }
}

export async function getArticleSEO(slug: string, locale: string) {
  const post = await getArticleSeoPropsBySlug(slug, locale)

  return {
    title: post.title,
    description: post.desc,
    image: post.banner,
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

export function extractHeadings(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const usedIds = new Set<string>();

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (usedIds.has(id)) {
      let counter = 1;
      while (usedIds.has(`${id}-${counter}`)) {
        counter++;
      }
      id = `${id}-${counter}`;
    }

    usedIds.add(id);
    headings.push({ id, text, level });
  }
  return headings;
}
