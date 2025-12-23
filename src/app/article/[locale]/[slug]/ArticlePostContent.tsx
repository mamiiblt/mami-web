"use client"

import { motion } from "framer-motion"
import type { Article } from "@/lib/article"
import { TableOfContents } from "@/components/articles/TableOfContents"
import ReactMarkdown from "react-markdown"
import { type ComponentPropsWithoutRef, useEffect, useState } from "react"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock } from "lucide-react"
import Image from "next/image"
import {Trans, useTranslation} from "react-i18next"
import { usePathname, useRouter } from "next/navigation"
import { convertDateToStr } from "@/app/articles/ClientArticleContent"
import { DesktopStats } from "@/components/articles/DesktopStats"
import { MobileStats } from "@/components/articles/MobileStats"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link"

interface BlogPostContentProps {
    post: Article
    headings: Array<{ id: string; text: string; level: number }>
}

export default function ArticlePostContent({ post, headings }: BlogPostContentProps) {
    const { t, i18n } = useTranslation("articles")
    const router = useRouter()
    const pathname = usePathname()
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(41)

    useEffect(() => {
        const pathLocale = pathname.split("/")[2]
        if (pathLocale != i18n.language) {
            router.push(pathname.replace(pathLocale, i18n.language))
        }
    }, [])

    const handleLikeToggle = () => {
        setLiked(!liked)
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 xl:gap-16">
                    <article className="min-w-0">
                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 space-y-6"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-serif font-bold text-balance leading-tight tracking-tight">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <time dateTime={post.date} className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(convertDateToStr(post.date).toISOString(), i18n.language)}
                                </time>
                                <span className="text-border">•</span>
                                <Link href={"/about"}>
                                    <span className="flex items-center gap-1.5">
                                    <Avatar className={"h-7 w-7"}>
                                        <AvatarImage src="/mamiiblt.png" alt="@shadcn" />
                                        <AvatarFallback>MA</AvatarFallback>
                                    </Avatar>
                                        <Trans
                                            t={t}
                                            i18nKey="writtenBy"
                                            components={{
                                                b: <span className="font-bold" />,
                                            }}
                                        />
                                    </span>
                                </Link>
                            </div>

                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">{post.description}</p>
                        </motion.header>

                        {post.banner && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-sm border border-border/50"
                            >
                                <Image
                                    src={post.banner || "/placeholder.svg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        )}

                        <MobileStats
                            readingTime={t("readDur", { minutes: post.readingTime })}
                            topic={post.topic}
                            views="45 görüntülenme"
                            comments="47 yorum"
                            likeSize={likeCount}
                            liked={liked}
                            onLikeToggle={handleLikeToggle}
                            likedText="Beğendim"
                            unlikedText="Beğen"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
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
                                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                                    [rehypeHighlight, { detect: true, ignoreMissing: true }],
                                ]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 {...props} className="scroll-mt-24 text-4xl font-bold my-8" />,
                                    h2: ({ node, ...props }) => <h2 {...props} className="scroll-mt-24 text-3xl font-bold my-6" />,
                                    h3: ({ node, ...props }) => <h3 {...props} className="scroll-mt-24 text-2xl font-bold my-5" />,
                                    h4: ({ node, ...props }) => <h4 {...props} className="scroll-mt-24 text-xl font-bold my-4" />,
                                    h5: ({ node, ...props }) => <h5 {...props} className="scroll-mt-24 text-lg font-bold my-3" />,
                                    h6: ({ node, ...props }) => <h6 {...props} className="scroll-mt-24 text-base font-bold my-2" />,
                                    p: ({ node, ...props }) => <p {...props} className="my-4 leading-8" />,
                                    ul: ({ node, ...props }) => (
                                        <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-3 marker:text-primary" />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-3 marker:text-primary" />
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            {...props}
                                            className="my-6 border-l-4 border-primary bg-secondary/20 p-4 rounded-r-lg italic"
                                        />
                                    ),
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-8">
                                            <table {...props} className="w-full border-collapse text-sm" />
                                        </div>
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th {...props} className="border border-slate-200 px-4 py-3 text-left font-bold bg-secondary/30" />
                                    ),
                                    td: ({ node, ...props }) => <td {...props} className="border border-slate-200 px-4 py-3" />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            {...props}
                                            className="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 transition-colors"
                                        />
                                    ),
                                    code: ({ inline, ...props }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => (
                                        <code
                                            {...props}
                                            className={inline ? "bg-secondary/50 px-1.5 py-0.5 rounded-md text-sm font-medium" : ""}
                                        />
                                    ),
                                    pre: ({ node, ...props }) => (
                                        <pre {...props} className="my-8 overflow-x-auto rounded-xl bg-secondary/50 p-6" />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </motion.div>
                    </article>

                    <aside className="hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="sticky top-24 space-y-4"
                        >
                            <TableOfContents headings={headings} otpTitle={t("otpTitle")} />

                            <DesktopStats
                                publishTxt={t("readDur", { minutes: post.readingTime })}
                                topicTxt={post.topic}
                                visitTxt={t("viewText", { count: 45 })}
                                likeSize={likeCount}
                                likedText={t("unlike")}
                                unlikedText={t("like")}
                                commentTxt={t("commentText", { count: 10 })}
                                liked={liked}
                                setLiked={setLiked}
                                contentTitle={"Makale hakkında?"}
                            />
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
