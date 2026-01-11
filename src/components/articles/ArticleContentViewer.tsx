import {motion} from "framer-motion";
import {Calendar, EyeIcon, Github, GlobeIcon, Mail, SendIcon} from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import React, {ComponentPropsWithoutRef, ReactElement} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function ArticleContentViewer(
    {
        writtenByText,
        content,
        bannerSrc,
        title,
        desc,
        viewText,
        dateStr,
        dateIso,
        ArticleCommentComp,
        MobileStatsComp
    }: {
        writtenByText: string,
        content: string,
        bannerSrc: string,
        title: string,
        desc: string,
        viewText: string
        dateStr: string
        dateIso: string
        ArticleCommentComp?: React.ReactNode
        MobileStatsComp?: React.ReactNode
    }) {
    return (
        <>
            <motion.header
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="mb-8 space-y-6"
            >
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-serif font-bold text-balance leading-tight tracking-tight">
                    {title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={dateIso}
                          className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5"/>
                        {dateStr}
                    </time>
                    <span className="text-border">•</span>
                    <EyeIcon className="h-3.5 w-3.5"/>
                    {viewText}
                </div>

                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">{desc}</p>
            </motion.header>

            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2, duration: 0.5}}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-sm border border-border/50"
            >
                <Image
                    src={bannerSrc}
                    alt={title}
                    unoptimized={true}
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>

            {MobileStatsComp && MobileStatsComp}

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
                    {content}
                </ReactMarkdown>
            </motion.div>

            <div className="flex items-center justify-between py-6 mt-8 border-t border-border">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="/mamiiblt.png" alt="M. Ali BULUT"/>
                        <AvatarFallback>MAB</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sfm text-muted-foreground">{writtenByText}</span>
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

            {ArticleCommentComp && ArticleCommentComp}
        </>
    )
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