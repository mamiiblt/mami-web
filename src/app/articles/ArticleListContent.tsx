"use client";

import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import {useRouter, useSearchParams} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {Page, PageHeader} from "@/components/PageUtils";
import {
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    NewspaperIcon,
    Search,
    SearchSlash, X
} from "lucide-react";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {getBannerUrl} from "@/lib/utils";
import {GetArticleListResponse} from "@/lib/articles/getArticleList";

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

export default function ArticleListContent(
    { list, page, topic, search }
    : {
        list: GetArticleListResponse
        page: number
        topic: string
        search: string
    }
) {
    const {t, i18n} = useTranslation("articles_list");
    const searchParams = useSearchParams()
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(decodeURIComponent(search ? search : ""))
    const [selectedCategory, setSelectedCategory] = useState<string | null>(topic ? topic : "")

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
        }
    }
    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim().length == 0) {
            params.delete("search")
        } else {
            params.set("search", encodeURIComponent(searchQuery.trim()));

        }
        params.delete("page");
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleCategory = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        setSelectedCategory(category)
        if (category != "all") {
            params.set("topic", category)
        } else {
            params.delete("topic")
        }
        params.delete("page");
        router.push(`?${params.toString()}`);
    }

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (list.data.totalPageSize <= maxVisiblePages) {
            for (let i = 1; i <= list.data.totalPageSize; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("ellipsis");
                pages.push(list.data.totalPageSize);
            } else if (page >= list.data.totalPageSize - 2) {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = list.data.totalPageSize - 3; i <= list.data.totalPageSize; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                }
                pages.push("ellipsis");
                pages.push(list.data.totalPageSize);
            }
        }

        return pages;
    };
    return (
        <Page
            width={6}
            header={
                <PageHeader
                    icon={<NewspaperIcon/>}
                    title={t("allTitle")}
                    subtitle={t("allDescription")}
                />
            }
            content={<>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-12 pr-10 h-12 text-lg bg-card border-border focus-visible:ring-secondary"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <Button onClick={handleSearch} size="lg" className="h-12 px-4">
                            <Search className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="lg" className="h-12 px-4 bg-transparent">
                                    <Filter className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuRadioGroup value={selectedCategory || ""} onValueChange={handleCategory}>
                                    <DropdownMenuRadioItem key={"all"} value={"all"}>
                                        {t("all")}
                                    </DropdownMenuRadioItem>
                                    <Separator orientation={"horizontal"}/>
                                    {list.data.topics.map((category) => (
                                        <DropdownMenuRadioItem key={category} value={category}>
                                            {category}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <AnimatePresence mode="wait">
                        {list.data.articles.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.95}}
                                className="text-center py-24 justify-items-center"
                            >
                                <SearchSlash className="w-20 h-20 mb-4"/>
                                <h2 className="text-2xl font-semibold mb-2">{t("nPTitle")}</h2>
                                <p className="text-muted-foreground">{t("nPDesc")}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {list.data.articles.map((post, idx) => (
                                    <Link key={idx} href={`/article/${i18n.language}/${post.id}`}>
                                        <motion.div variants={itemVariants} custom={idx}>
                                            <Card
                                                className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border hover:border-primary/50 relative">
                                                <div className="relative w-full h-48 overflow-hidden bg-secondary">
                                                    <Image
                                                        src={getBannerUrl(post.id_a)}
                                                        alt={post.tt}
                                                        fill
                                                        className="object-cover transition-transform duration-300"
                                                    />
                                                </div>

                                                <div
                                                    className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                                    {post.tp}
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex-1 space-y-3">
                                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-balance leading-snug">
                                                                {post.tt}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                                                {post.dc}
                                                            </p>
                                                        </div>

                                                        <div className="mt-3 space-y-4">
                                                            <div
                                                                className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                                                <div className="flex flex-wrap items-center gap-4">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Calendar className="h-3.5 w-3.5"/>
                                                                        {new Date(post.dt).toLocaleDateString(i18n.language, {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        })}
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Clock className="h-3.5 w-3.5"/>
                                                                        {t("readDur", {minutes: post.rt})}
                                                                    </span>
                                                                </div>
                                                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
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


                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.8, duration: 0.6}}
                        className="flex justify-center mt-6"
                    >
                        <Pagination>
                            <PaginationContent className="flex items-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            page > 1 && handlePageChange(page - 1)
                                        }
                                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                            ${
                                            page <= 1
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-muted cursor-pointer"
                                        }
                          `}
                                    >
                                        <ChevronLeft className="h-4 w-4"/>
                                        <span className="hidden sm:inline">Previous</span>
                                    </PaginationPrevious>
                                </PaginationItem>


                                {generatePageNumbers().map((pageNum, index) => (
                                    <PaginationItem key={index}>
                                        {pageNum === "ellipsis" ? (
                                            <PaginationEllipsis className="px-3 py-2"/>
                                        ) : (
                                            <PaginationLink
                                                onClick={() =>
                                                    handlePageChange(pageNum as number)
                                                }
                                                isActive={page === pageNum}
                                                className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer${
                                                    page === pageNum
                                                        ? "text-foreground shadow-sm"
                                                        : "hover:bg-muted"
                                                }`}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            page < list.data.totalPageSize &&
                                            handlePageChange(page + 1)
                                        }
                                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                            ${
                                            page >= list.data.totalPageSize
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-muted cursor-pointer"
                                        }
                          `}
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight className="h-4 w-4"/>
                                    </PaginationNext>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </motion.div>
                </motion.div>
            </>}
        />
    );
}

