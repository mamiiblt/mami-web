"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {ChevronLeft, ChevronRight, Trash2, MessageSquare} from "lucide-react"
import {useTranslation} from "react-i18next";
import {CommentData, GetCommentResponse} from "@/lib/articles/getComments";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {generatePageNumbers} from "@/lib/utils";
import {motion} from "framer-motion";
import {CommentDeleteResponse} from "@/app/api/article/comments/delete/route";
import {toast} from "sonner";

interface ArticleCommentsProps {
    fetchComments: GetCommentResponse
    sid: string
    id_a: number
}

export function ArticleComments({ fetchComments, sid, id_a }: ArticleCommentsProps) {

    const [comments, setComments] = useState<CommentData[]>(fetchComments.data.comments)
    const [page, setPage]= useState<number>(fetchComments.data.info.currentPage)

    const [newComment, setNewComment] = useState("")
    const [commentAuthor, setCommentAuthor] = useState("")
    const {t, i18n} = useTranslation("articles")

    const handleDeleteComment = async (comment_id: string) => {
        try {
            const request = await fetch(`/api/article/comments/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment_id,
                    sid
                }),
            });

            const data: CommentDeleteResponse = await request.json()

            switch (data.code) {
                case "COMMENT_NOT_FOUND":
                    showToast(t("commentDelete.FAILURE"), t("commentDelete.code.COMMENT_NOT_FOUND"), false)
                    break;
                case "SID_DOES_NOT_MATCH":
                    showToast(t("commentDelete.FAILURE"), t("commentDelete.code.SID_DOES_NOT_MATCH"), false)
                    break;
                case "DELETE_SUCCESS":
                    showToast(t("commentDelete.SUCCESS"), t("commentDelete.code.DELETE_SUCCESS"), true)
                    setComments(prevState => prevState.filter(comment => comment.comment_id !== comment_id))
                    break;
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleNewComment = async () => {
        try {
            const request = await fetch(`/api/article/comments/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_a,
                    sid,
                    content: newComment,
                    author_name: commentAuthor,
                    locale: i18n.language
                }),
            });

            const response = await request.json()

            const title = response.code == "SHARE_SUCCESS" ? t("commentDelete.SUCCESS") : t("commentDelete.FAILURE")
            showToast(title, response.message, title == "SHARE_SUCCESS")

            if (response.code == "SHARE_SUCCESS") {
                setNewComment("")
                setCommentAuthor("")
                await handlePageChange(1)
            }

        } catch (e) {
            console.error(e)
        }
    }

    const showToast = (title: string, message: string, toastIsSuccess: boolean) => {
        const toastType = toastIsSuccess ? toast.success : toast.error
        toastType(title, {
            description: message,
            action: {
                label: t("commentDelete.buttonOkay"),
                onClick: () => { }
            },
        })
    }

    const handlePageChange = async (newPage: number) => {
       if (newPage <= fetchComments.data.info.totalPageSize) {
           try {
               const request = await fetch(`/api/article/comments/get`, {
                   method: "POST",
                   headers: {
                       "Content-Type": "application/json",
                   },
                   body: JSON.stringify({
                       id_a: id_a,
                       sid: sid,
                       page: newPage
                   }),
               });

               const data: GetCommentResponse = await request.json()
               setComments(data.data.comments)
               setPage(newPage)
           } catch (e) {
               console.error(e)
           }
       }
    };

    return (
        <div className="space-y-8 border-t border-border py-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">{t("comments.header")}</h2>
                <p className="text-sm text-muted-foreground">{t("comments.countComment", { count: fetchComments.data.comments.length})}</p>
            </div>

            <div className="space-y-4">
                <Input placeholder={t("comments.yourName")} maxLength={35} value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} />
                <Textarea
                    placeholder={t("comments.writeCom")}
                    value={newComment}
                    maxLength={500}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
                <Button onClick={handleNewComment} disabled={!newComment.trim() || !commentAuthor.trim()}>
                    {t("comments.shareCom")}
                </Button>
            </div>

            {comments.length != 0 ? <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-4 group">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>
                                {comment.author_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                    {comment.author_name}
                </span>
                                    <span className="text-sm text-muted-foreground">
                    {timeAgo(comment.publish_time, i18n.language)}
                </span>
                                </div>

                                {comment.is_owner && <Button
                                    variant={"outline"}
                                    size="icon"
                                    className="transition"
                                    onClick={() => handleDeleteComment(comment.comment_id)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>}
                            </div>

                            <p className="text-sm text-foreground leading-relaxed">
                                {comment.comment}
                            </p>
                        </div>
                    </div>

                ))}

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
                                </PaginationPrevious>
                            </PaginationItem>


                            {generatePageNumbers(fetchComments.data.info.totalPageSize, page).map((pageNum, index) => (
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
                                        page < fetchComments.data.comments.length &&
                                        handlePageChange(page + 1)
                                    }
                                    className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                            ${
                                        page >= fetchComments.data.comments.length
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-muted cursor-pointer"
                                    }
                          `}
                                >
                                    <ChevronRight className="h-4 w-4"/>
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </motion.div>
            </div>
            :     <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
                        <div className="relative bg-muted/50 backdrop-blur-sm rounded-full p-6 border border-border/50">
                            <MessageSquare className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-foreground mb-3 text-balance text-center">
                        {t("noAnyCommentSharedTT")}
                    </h2>

                    <p className="text-muted-foreground text-center text-balance mb-8 max-w-md leading-relaxed">
                        {t("noAnyCommentSharedDC")}
                    </p>
                </div>}
        </div>
    )
}

export function timeAgo(
    dateInput: string | Date,
    locale: string = "en"
): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    const now = new Date()

    const diffSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: "auto"
    })

    const divisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
        { amount: 60, name: "second" },
        { amount: 60, name: "minute" },
        { amount: 24, name: "hour" },
        { amount: 7, name: "day" },
        { amount: 4.34524, name: "week" },
        { amount: 12, name: "month" },
        { amount: Infinity, name: "year" }
    ]

    let duration = diffSeconds

    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return rtf.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }

    return rtf.format(0, "second")
}
