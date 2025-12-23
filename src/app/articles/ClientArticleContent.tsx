"use client";

import {useState, useEffect, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    ArrowUpRight, Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    NewspaperIcon,
    Search, SearchSlash
} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Page, PageHeader} from "@/components/PageUtils";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {Article} from "@/lib/article";

interface ClientArticleContentProps {
    title: string;
    description: string;
    posts: Article[];
}

const POSTS_PER_PAGE = 15;
const DEBOUNCE_DELAY = 300;

const containerVariants = {
    hidden: {opacity: 0},
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
    exit: {opacity: 0},
};

const itemVariants = {
    hidden: {opacity: 0, y: 20},
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

export function ClientBlogContent({
                                      title,
                                      description,
                                      posts: articlePosts,
                                  }: ClientArticleContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const {t, i18n} = useTranslation("articles");


    const allTopics = useMemo(() => {
        const topics = new Set<string>();
        articlePosts.forEach((post) => {
            topics.add(post.topic);
        });
        return Array.from(topics).sort();
    }, [articlePosts]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredPosts = articlePosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            post.topic
                ?.toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase());

        const matchesTags =
            selectedTopics.length === 0 ||
            selectedTopics.every((tag) => post.topic.includes(tag));

        return matchesSearch && matchesTags;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedTopics]);

    const toggleTag = (tag: string) => {
        setSelectedTopics((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <Page
            width={6}
            header={
                <PageHeader
                    icon={<NewspaperIcon/>}
                    title={title}
                    subtitle={description}
                />
            }
            content={<>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-6 space-y-6">
                    <motion.div variants={itemVariants} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        <Input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-13 text-lg bg-card border-border focus-visible:ring-secondary"
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="flex flex-wrap gap-2">
                            {allTopics.map((topic) => (
                                <motion.button
                                    key={topic}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={() => toggleTag(topic)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedTopics.includes(topic)
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                                >
                                    {topic}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {(searchQuery || selectedTopics.length > 0) && (
                        <motion.div variants={itemVariants} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                    {t("found", { count: filteredPosts.length })}
                </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("")
                                    setSelectedTopics([])
                                }}
                                className="h-8"
                            >
                                {t("clearFilters")}
                            </Button>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence mode="wait">
                    {paginatedPosts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            className="text-center py-24 justify-items-center"
                        >
                            <SearchSlash className="w-20 h-20 mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">{t("noPostsTitle")}</h2>
                            <p className="text-muted-foreground">{t("noPostsDescription")}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {paginatedPosts.map((post, index) => (
                                <Link key={post.slug} href={`/article/${post.locale}/${post.slug}`}>
                                    <motion.div  variants={itemVariants} custom={index}>
                                        <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border hover:border-primary/50 relative">
                                            <div className="relative w-full h-48 overflow-hidden bg-secondary">
                                                <Image
                                                    src={
                                                        post.banner ||
                                                        `/placeholder.svg?height=192&width=384&query=${encodeURIComponent(post.title)}`
                                                    }
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300"
                                                />
                                            </div>

                                            <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                                {post.topic}
                                            </div>

                                            <div className="p-6">
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1 space-y-3">
                                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-balance leading-snug">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                                            {post.description}
                                                        </p>
                                                    </div>

                                                    <div className="mt-3 space-y-4">
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                                            <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                      {new Date(convertDateToStr(post.date)).toLocaleDateString(i18n.language, {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })}
                                  </span>
                                                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                                                    {t("readDur", { minutes: post.readingTime})}
                                  </span>
                                                            </div>
                                                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>

                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {totalPages > 1 && paginatedPosts.length > 0 && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="flex items-center justify-center gap-2 mt-12"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-10 w-10"
                        >
                            <ChevronLeft className="h-5 w-5"/>
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-10 w-10 ${currentPage === page ? "bg-primary text-primary-foreground" : ""}`}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-10 w-10"
                        >
                            <ChevronRight className="h-5 w-5"/>
                        </Button>
                    </motion.div>
                )}
            </>
            }
        />
    )
}

export function convertDateToStr(dateText: string): Date {
    const [day, month, year] = dateText.split(".").map(Number);
    return new Date(year, month - 1, day);
}
