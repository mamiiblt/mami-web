"use client"

import {motion} from "framer-motion"
import {TableOfContents} from "@/components/articles/TableOfContents"
import React, {useEffect, useState} from "react"
import {formatDate, getBannerUrl} from "@/lib/utils"
import {useTranslation} from "react-i18next"
import {usePathname, useRouter} from "next/navigation"
import {DesktopStats} from "@/components/articles/DesktopStats"
import {MobileStats} from "@/components/articles/MobileStats"
import {LikeButton} from "@/components/articles/LikeButton";
import {ArticleComments} from "@/components/articles/ArticleComments";
import {GetArticleResponse} from "@/lib/articles/getArticle";
import {GetCommentResponse} from "@/lib/articles/getComments";
import ArticleContentViewer from "@/components/articles/ArticleContentViewer";

interface ArticlePostContentProps {
    post: GetArticleResponse
    fetchComments: GetCommentResponse
    slug: string
    session_id: string
}

export default function ArticlePostContent({ post, slug, session_id, fetchComments }: ArticlePostContentProps) {
    const {t, i18n} = useTranslation("articles")
    const router = useRouter()
    const pathname = usePathname()
    const [likeCount, setLikeCount] = useState(post.data.articleData.lc)
    const [isPostLiked, setIsPostLiked] = useState(post.data.gen.ipl)
    const [sessionId, setSessionId] = useState<string>(session_id)

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                // redirect to correct language
                const pathLocale = pathname.split("/")[2]
                if (pathLocale != i18n.language) {
                    router.push(pathname.replace(pathLocale, i18n.language))
                }

                if (post.data.gen.iscn) {
                    await fetch("/api/sessionCookie/set", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({value: post.data.gen.sid}),
                    });

                    if (isMounted) setSessionId(post.data.gen.sid);
                }

            } catch (err) {
                console.error("Init error:", err);
            }
        };

        init();
        return () => {
            isMounted = false
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 xl:gap-16">
                    <article className="min-w-0">
                        <ArticleContentViewer
                            writtenByText={t("writtenBy")}
                            content={post.data.articleData.cn}
                            bannerSrc={getBannerUrl(post.data.articleData.banner_fn)}
                            title={post.data.articleData.tt}
                            desc={post.data.articleData.dc}
                            viewText={t("viewText", {count: post.data.articleData.vc})}
                            dateStr={formatDate(post.data.articleData.dt, i18n.language)}
                            dateIso={post.data.articleData.dt}
                            ArticleCommentComp={<ArticleComments fetchComments={fetchComments} sid={post.data.gen.sid} id_a={post.data.articleData.id_a} />}
                            MobileStatsComp={
                                <MobileStats
                                    publishTxt={t("readDur", {minutes: calculateReadingTimeMin(post.data.articleData.cn)})}
                                    topicTxt={post.data.articleData.tp}
                                    likeTxt={t("likeText", {count: likeCount})}
                                    commentTxt={t("commentText", {count: fetchComments.data.comments.length })}
                                    likeButton={<LikeButton
                                        isPostLiked={isPostLiked}
                                        setIsPostLiked={setIsPostLiked}
                                        setLikeCount={setLikeCount}
                                        sessionId={sessionId}
                                        articleDbId={post.data.articleData.id_a}
                                    />}
                                />
                        }/>
                    </article>

                    <aside className="hidden lg:block">
                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.4, duration: 0.5}}
                            className="sticky top-24 space-y-4"
                        >
                            <TableOfContents headings={extractHeadings(post.data.articleData.cn)}
                                             otpTitle={t("otpTitle")}/>

                            <DesktopStats
                                publishTxt={t("readDur", {minutes: calculateReadingTimeMin(post.data.articleData.cn)})}
                                topicTxt={post.data.articleData.tp}
                                commentTxt={t("commentText", {count: fetchComments.data.comments.length })}
                                contentTitle={t("aboutArticle")}
                                likeTxt={t("likeText", {count: likeCount})}
                                likeButton={<LikeButton
                                    isPostLiked={isPostLiked}
                                    setIsPostLiked={setIsPostLiked}
                                    setLikeCount={setLikeCount}
                                    sessionId={sessionId}
                                    articleDbId={post.data.articleData.id_a}
                                />}
                            />
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    )
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
        headings.push({id, text, level});
    }
    return headings;
}