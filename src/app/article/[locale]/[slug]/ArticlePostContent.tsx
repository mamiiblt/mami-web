"use client"

import {motion} from "framer-motion"
import {TableOfContents} from "@/components/articles/TableOfContents"
import ReactMarkdown from "react-markdown"
import React, {type ComponentPropsWithoutRef, ReactElement, useEffect, useState} from "react"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import {formatDate, getBannerUrl} from "@/lib/utils"
import {Calendar, EyeIcon, FileX, Github, GlobeIcon, Mail, SendIcon} from "lucide-react"
import Image from "next/image"
import {useTranslation} from "react-i18next"
import {usePathname, useRouter} from "next/navigation"
import {DesktopStats} from "@/components/articles/DesktopStats"
import {MobileStats} from "@/components/articles/MobileStats"
import {LikeButton} from "@/components/articles/LikeButton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArticleComments} from "@/components/articles/ArticleComments";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"

interface BlogPostContentProps {
    slug: string
    locale: string
}

export interface ArticleViewResponse {
    status: string;
    gen: {
        id: string
        sid: string
        ipl: boolean
        iscn: boolean
    }
    articleData: {
        lc: number
        vc: number
        dt: string
        tp: string
        id_a: number
        tt: string
        dc: string
        cn: string
    }
}

export default function ArticlePostContent({slug}: BlogPostContentProps) {
    const {t, i18n} = useTranslation("articles")
    const router = useRouter()
    const pathname = usePathname()
    const [likeCount, setLikeCount] = useState(0) // will be changed with request
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string>("undefined")
    const [articleViewData, setArticleViewData] = useState<ArticleViewResponse | undefined>(undefined)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                // redirect to correct language
                const pathLocale = pathname.split("/")[2]
                if (pathLocale != i18n.language) {
                    router.push(pathname.replace(pathLocale, i18n.language))
                }

                const sessionRes = await fetch("/api/sessionCookie/get");
                const {sessionIdValue} = await sessionRes.json();

                if (isMounted) setSessionId(sessionIdValue);

                const postRes = await fetch(`${process.env.API_BASE}/content/mami/article_view`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        article_id: slug,
                        session_id: sessionIdValue,
                        locale: i18n.language
                    })
                });

                const postData: ArticleViewResponse = await postRes.json();

                if (postData.status == "ERROR") {
                    if (isMounted) setNotFound(true)
                    return;
                }

                if (postData.gen.iscn) {
                    await fetch("/api/sessionCookie/set", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({value: postData.gen.sid}),
                    });

                    if (isMounted) setSessionId(postData.gen.sid);
                }
                if (isMounted) setArticleViewData(postData);
                if (isMounted) setLikeCount(postData.articleData.lc)
                if (isMounted) setIsPostLiked(postData.gen.ipl)

                console.log("Article ID:", slug);
                console.log("Article DB ID:", postData.articleData.id_a)
                console.log("Session ID used:", sessionIdValue);

                console.log(postData)

            } catch (err) {
                console.error("Init error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        init();
        return () => {
            isMounted = false
        };
    }, []);

    if (notFound) {
        return  <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">{t("notFound")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-muted p-6">
                        <FileX className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-center">
                        {t("notFoundDesc")}
                    </p>
                </CardContent>
            </Card>
        </div>
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-80 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">{t("loading")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Spinner className="h-12 w-12"/>
                    <p className="text-muted-foreground text-center text-sm">{t("pleaseWait")}</p>
                </CardContent>
            </Card>
        </div>
    }


    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 xl:gap-16">
                    <article className="min-w-0">
                        <motion.header
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                            className="mb-8 space-y-6"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-serif font-bold text-balance leading-tight tracking-tight">
                                {articleViewData.articleData.tt}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <time dateTime={articleViewData.articleData.dt}
                                      className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5"/>
                                    {formatDate(articleViewData.articleData.dt, i18n.language)}
                                </time>
                                <span className="text-border">•</span>
                                <EyeIcon className="h-3.5 w-3.5"/>
                                {t("viewText", {count: articleViewData.articleData.vc})}
                            </div>

                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">{articleViewData.articleData.dc}</p>
                        </motion.header>

                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2, duration: 0.5}}
                            className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-sm border border-border/50"
                        >
                            <Image
                                src={getBannerUrl(articleViewData.articleData.id_a)}
                                alt={articleViewData.articleData.tt}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        <MobileStats
                            publishTxt={t("readDur", {minutes: calculateReadingTimeMin(articleViewData.articleData.cn)})}
                            topicTxt={articleViewData.articleData.tp}
                            likeTxt={t("likeText", {count: likeCount})}
                            commentTxt={t("commentText", {count: 0})}
                            likeButton={<LikeButton
                                isPostLiked={isPostLiked}
                                setIsPostLiked={setIsPostLiked}
                                setLikeCount={setLikeCount}
                                sessionId={sessionId}
                                articleDbId={articleViewData.articleData.id_a}
                            />}
                        />

                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.7, duration: 0.5}}
                            className="prose dark:prose-invert max-w-none leading-relaxed
    prose-h1:text-4xl prose-h1:font-bold
    prose-h2:text-3xl prose-h2:font-bold
    prose-h3:text-2xl prose-h3:font-bold
    prose-h4:text-xl prose-h4:font-bold
    prose-p:my-6 prose-p:leading-8
    prose-a:text-primary prose-a:transition-colors prose-a:duration-200
    prose-img:rounded-xl prose-img:shadow-xl
    prose-pre:bg-secondary/50
    prose-pre:p-6
    prose-pre:rounded-xl
    prose-code:text-primary
    prose-blockquote:border-l-4
    prose-blockquote:border-primary
    prose-blockquote:bg-secondary/20
    prose-blockquote:p-4
    prose-blockquote:rounded-r-lg"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[
                                    rehypeSlug,
                                    [rehypeAutolinkHeadings, {behavior: "wrap"}],
                                    [rehypeHighlight, {detect: true, ignoreMissing: true}],
                                ]}
                                components={{
                                    h1: ({node, ...props}) => <h1 {...props}
                                                                  className="scroll-mt-24 text-4xl font-bold my-8"/>,
                                    h2: ({node, ...props}) => <h2 {...props}
                                                                  className="scroll-mt-24 text-3xl font-bold my-6"/>,
                                    h3: ({node, ...props}) => <h3 {...props}
                                                                  className="scroll-mt-24 text-2xl font-bold my-5"/>,
                                    h4: ({node, ...props}) => <h4 {...props}
                                                                  className="scroll-mt-24 text-xl font-bold my-4"/>,
                                    h5: ({node, ...props}) => <h5 {...props}
                                                                  className="scroll-mt-24 text-lg font-bold my-3"/>,
                                    h6: ({node, ...props}) => <h6 {...props}
                                                                  className="scroll-mt-24 text-base font-bold my-2"/>,
                                    p: ({node, ...props}) => <p {...props} className="my-4 leading-8"/>,
                                    ul: ({node, ...props}) => (
                                        <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-3 marker:text-primary"/>
                                    ),
                                    ol: ({node, ...props}) => (
                                        <ol {...props}
                                            className="my-6 ml-6 list-decimal [&>li]:mt-3 marker:text-primary"/>
                                    ),
                                    blockquote: ({node, ...props}) => (
                                        <blockquote
                                            {...props}
                                            className="my-6 border-l-4 border-primary bg-secondary/20 p-4 rounded-r-lg italic"
                                        />
                                    ),
                                    table: ({node, ...props}) => (
                                        <div className="overflow-x-auto my-8">
                                            <table {...props} className="w-full border-collapse text-sm"/>
                                        </div>
                                    ),
                                    th: ({node, ...props}) => (
                                        <th {...props}
                                            className="border border-slate-200 px-4 py-3 text-left font-bold bg-secondary/30"/>
                                    ),
                                    td: ({node, ...props}) => <td {...props}
                                                                  className="border border-slate-200 px-4 py-3"/>,
                                    a: ({node, ...props}) => (
                                        <a
                                            {...props}
                                            className="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors"
                                        />
                                    ),
                                    code: ({inline, ...props}: ComponentPropsWithoutRef<"code"> & {
                                        inline?: boolean
                                    }) => (
                                        <code
                                            {...props}
                                            className={inline ? "bg-secondary/50 px-1.5 py-0.5 rounded-md text-sm font-medium" : ""}
                                        />
                                    ),
                                    pre: ({node, ...props}) => (
                                        <pre {...props}
                                             className="my-8 overflow-x-auto rounded-xl bg-secondary/50 p-6"/>
                                    ),
                                }}
                            >
                                {articleViewData.articleData.cn}
                            </ReactMarkdown>
                        </motion.div>

                        <div className="flex items-center justify-between py-6 mt-8 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src="/mamiiblt.png" alt="M. Ali BULUT"/>
                                    <AvatarFallback>MAB</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sfm text-muted-foreground">{t("writtenBy")}</span>
                                    <span className="text-base font-medium text-foreground">M. Ali BULUT</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <SocialButton icon={<GlobeIcon/>} href={"/about"} ariaLabel={"About"}/>
                                <SocialButton icon={<Github/>} href={"https://github.com/mamiiblt"}
                                              ariaLabel={"GitHub"}/>
                                <SocialButton icon={<SendIcon/>} href={"https://t.me/mamiiblt"} ariaLabel={"Telegram"}/>
                                <SocialButton icon={<Mail/>} href={"mailto:mami@mamii.dev"} ariaLabel={"Telegram"}/>
                            </div>
                        </div>

                        <ArticleComments/>
                    </article>


                    <aside className="hidden lg:block">
                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.4, duration: 0.5}}
                            className="sticky top-24 space-y-4"
                        >
                            <TableOfContents headings={extractHeadings(articleViewData.articleData.cn)}
                                             otpTitle={t("otpTitle")}/>

                            <DesktopStats
                                publishTxt={t("readDur", {minutes: calculateReadingTimeMin(articleViewData.articleData.cn)})}
                                topicTxt={articleViewData.articleData.tp}
                                commentTxt={t("commentText", {count: 0})}
                                contentTitle={t("aboutArticle")}
                                likeTxt={t("likeText", {count: likeCount})}
                                likeButton={<LikeButton
                                    isPostLiked={isPostLiked}
                                    setIsPostLiked={setIsPostLiked}
                                    setLikeCount={setLikeCount}
                                    sessionId={sessionId}
                                    articleDbId={articleViewData.articleData.id_a}
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

function SocialButton({icon, href, ariaLabel}: { icon: ReactElement, href: string, ariaLabel: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={ariaLabel}
        >
            {React.cloneElement(icon, {
                ...(icon.props as any),
                className: "h-5 w-5",
            })}
        </a>
    )
}