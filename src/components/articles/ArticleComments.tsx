"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import {useTranslation} from "react-i18next";

interface Comment {
    id: number
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    dislikes: number
    userVote?: "like" | "dislike" | null
}

export function ArticleComments() {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            author: "Cemanur",
            avatar: "/example.png",
            date: "10 dakika önce",
            content: "Bu nasıl makale kardeşim ya",
            likes: 14,
            dislikes: 3,
            userVote: null,
        },
        {
            id: 2,
            author: "Berfin",
            avatar: "/example.png",
            date: "1 gün önce",
            content: "Muazzam olmus kardesim",
            likes: 3,
            dislikes: 7,
            userVote: null,
        },
        {
            id: 3,
            author: "Esma",
            avatar: "/example.png",
            date: "3 gün önce",
            content: "Ne anlatıyor ya bu",
            likes: 1,
            dislikes: 9,
            userVote: null,
        },
        {
            id: 4,
            author: "Ahmet",
            avatar: "/example.png",
            date: "7 gün önce",
            content: "Hayran kaldım valla muazzam",
            likes: 97,
            dislikes: 1,
            userVote: null,
        },
        {
            id: 5,
            author: "Enes",
            avatar: "/example.png",
            date: "1 ay önce",
            content: "Rezalet olmuş kardeşim ellerine sağlık",
            likes: 16,
            dislikes: 2,
            userVote: null,
        },
        {
            id: 6,
            author: "Çağdaş",
            avatar: "/example.png",
            date: "1 ay önce",
            content: "Yapacağın makalenin var ya",
            likes: 7,
            dislikes: 312,
            userVote: null,
        },

    ])
    const [newComment, setNewComment] = useState("")
    const [commentAuthor, setCommentAuthor] = useState("")
    const {t} = useTranslation("articles")

    return (
        <div className="space-y-8 border-t border-border py-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">{t("comments.header")}</h2>
                <p className="text-sm text-muted-foreground">{t("comments.countComment", { count: comments.length})}</p>
            </div>

            <form onSubmit={() => {}} className="space-y-4">
                <Input placeholder={t("comments.yourName")} value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} />
                <Textarea
                    placeholder={t("comments.writeCom")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                />
                <Button type="submit" disabled={!newComment.trim() || !commentAuthor.trim()}>
                    {t("comments.shareCom")}
                </Button>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{comment.author}</span>
                                <span className="text-sm text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {}}
                                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                                        comment.userVote === "like"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                                    }`}
                                    aria-label={t("comments.like")}
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{comment.likes}</span>
                                </button>
                                <button
                                    onClick={() => {}}
                                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                                        comment.userVote === "dislike"
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                                    }`}
                                    aria-label={t("comments.dislike")}
                                >
                                    <ThumbsDown className="h-4 w-4" />
                                    <span>{comment.dislikes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
