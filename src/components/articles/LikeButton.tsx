"use client"

import React, {useState} from "react"
import {ThumbsUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

export interface LikeButtonProps {
    isPostLiked: boolean;
    setIsPostLiked: React.Dispatch<React.SetStateAction<boolean>>;
    setLikeCount: React.Dispatch<React.SetStateAction<number>>;
    sessionId: string;
    articleDbId: number;
    className?: string;
}

export function LikeButton({isPostLiked, setIsPostLiked, setLikeCount, sessionId, articleDbId, className}: LikeButtonProps) {
    const { t } = useTranslation("articles")
    const [isProcessing, setIsProcessing] = useState(false)
    const [likedTextState, setLikedTextState] = useState(false)

    const handleLike = async () => {
        if (isProcessing) return
        setIsProcessing(true)

        try {
            const request = await fetch(`/api/article/${
                isPostLiked ? "unlike" : "like"
            }`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_a: articleDbId,
                    sid: sessionId
                }),
            });
            const data = await request.json()

            switch (data.status) {
                case "POST_LIKE_SUCCESS":
                    setIsPostLiked(true)
                    setLikeCount(prev => prev + 1)
                    break;
                case "POST_UNLIKE_SUCCESS":
                    setIsPostLiked(false)
                    setLikeCount(prev => prev - 1)
                    break;
            }

            if (data.status != "POST_LIKE_SUCCESS" && data.status != "POST_UNLIKE_SUCCESS") {
                toast(t("likeToasts.STATUS_FAILURE"), {
                    description: t(`likeToasts.${data.status.trim() as string}`),
                    action: {
                        label: t("likeToasts.buttonOkay"),
                        onClick: () => { }
                    },
                })
            } else {
                if (data.status == "POST_LIKE_SUCCESS") {
                    setLikedTextState(true)
                    setTimeout(() => setLikedTextState(false), 2000)
                }
            }
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Button
            onClick={handleLike}
            variant={isPostLiked ? "default" : "outline"}
            size="lg"
            className={className}
        >
            <ThumbsUp className={`h-5 w-5 transition-all ${isPostLiked ? "fill-current" : ""}`} />
            <span className="font-semibold">{likedTextState ? t("likedPost") : isPostLiked ? t("liked") : t("like")}</span>
        </Button>
    )
}
