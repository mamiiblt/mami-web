import { Suspense } from "react";
import ArticlesContent from "./ArticlesContent";
import { getAllArticlePosts } from "@/lib/article";
import { cookies } from "next/headers"
import {cookieName} from "@/i18n/settings";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const cookieStore = await cookies()
    const localeCode = cookieStore.get(cookieName)
    const posts = await getAllArticlePosts(localeCode.value);

    return (
        <Suspense>
            <ArticlesContent posts={posts} />
        </Suspense>
    );
}
