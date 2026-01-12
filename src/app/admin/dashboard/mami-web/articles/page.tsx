"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {NewspaperIcon, Edit, Trash2, Plus, Search, FileText, LogOut, RefreshCcw} from "lucide-react"
import {formatDate} from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";

interface ArticleListInfo {
    id: string;
    title: string;
    desc: string;
    date: string;
    topic: string;
}

export default function ArticlesListPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [articles, setArticles] = useState<ArticleListInfo[] | undefined>(undefined)
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState<ArticleListInfo | null>(null)
    const [articleFetchLocale, setArticleFetchLocale] = useState<string>("en")

    useEffect(() => {
        const sendRequest = async () => {
            await sendAdminRequest({
                router,
                redirectToLogin: true,
                method: "POST",
                path: `content/articles_info`,
                body: JSON.stringify({
                    locale: articleFetchLocale
                }),
                onResponse: (response, status, data) => {
                    setArticles(data.articles)
                    setIsLoading(false)
                }
            })
        }

        sendRequest()
    }, [articleFetchLocale]);

    const filteredArticles = useMemo(() => {
        if (!articles) return []

        const query = searchQuery.toLowerCase()

        return articles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.desc.toLowerCase().includes(query) ||
            article.topic.toLowerCase().includes(query)
        )
    }, [articles, searchQuery])

    const handleDeleteClick = (article: ArticleListInfo) => {
        setSelectedArticle(article)
        setDeleteDialogOpen(true)
    }

    const handleDelete = () => {
        const sendRequest = async () => {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: `content/delete_article`,
                body: JSON.stringify({
                    article_id: selectedArticle.id
                }),
                onResponse: (response, status, data) => {
                    const toastType = status == ResponseStatus.SUCCESS ? toast.success : toast.error
                    toastType(status, {
                        description: data.msg
                    })

                    if (status == ResponseStatus.SUCCESS) {
                        setArticles((prev) => prev.filter((article) => article.id !== selectedArticle.id))
                        setDeleteDialogOpen(false)
                    }
                }
            })
        }

        sendRequest()
    }

    return (
        <DashboardLayout
            pageIcon={NewspaperIcon}
            title={"Articles"}
            description={"Manage written all articles from there."}
            loadingState={isLoading}
            actionBarItems={[
                <div key={"searchArticles"} className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search in articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>,
                <DropdownMenu key="listLanguage">
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">List Language</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>List Language</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={articleFetchLocale} onValueChange={setArticleFetchLocale}>
                            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="tr">Türkçe</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>,
                <Button
                    key={"refreshList"}
                    variant="outline"
                    size="icon"
                    className="size-9"
                >
                    <RefreshCcw className="size-4"/>
                </Button>,
                <Button key="createNewArticle" onClick={() => {
                    router.push(`/admin/dashboard/mami-web/articles/editor`)
                }} className="gap-2">
                    <Plus className="size-4" />
                    New Article
                </Button>
            ]}
        >
            <div className="space-y-6">
                <Card className={"p-2"}>
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No articles found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Article ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArticles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="max-w-md">
                                            <pre className="text-sm text-muted-foreground line-clamp-2">{article.id}</pre>
                                        </TableCell>
                                        <TableCell className="font-medium">{article.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(article.date)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={"bg-blue-500/10 text-blue-500 border-blue-500/20"}>
                                                {article.topic}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    router.push(`/admin/dashboard/mami-web/articles/editor?id=${article.id}`)
                                                }}>
                                                    <Edit className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(article)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the article{" "}
                            <span className="font-semibold">{selectedArticle?.title}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}