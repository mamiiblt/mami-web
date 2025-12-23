"use client"

import React, {ReactElement, useState} from "react"
import {Separator} from "@/components/ui/separator";
import {ClockIcon, EyeIcon, Heart, MessageCircle, TagIcon, ThumbsUp, ThumbsUpIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface DesktopStatsProps {
    publishTxt: string,
    topicTxt: string,
    visitTxt: string,
    likeSize: number,
    likedText: string,
    unlikedText: string,
    commentTxt: string,
    liked: boolean,
    setLiked: React.Dispatch<React.SetStateAction<boolean>>,
    contentTitle: string
}

export function DesktopStats({publishTxt, topicTxt, visitTxt, likeSize, likedText, unlikedText, commentTxt, liked, setLiked, contentTitle}: DesktopStatsProps) {
    const handleLike = () => {
        setLiked(!liked)
    }

    return (
        <>
            <p className="text-sm font-semibold text-foreground mb-4">{contentTitle}</p>
            <nav className="space-y-2">
                <StatTile icon={<ClockIcon />} text={publishTxt} />
                <StatTile icon={<TagIcon />} text={topicTxt} />
                <StatTile icon={<EyeIcon />} text={visitTxt} />
                <StatTile icon={<MessageCircle />} text={commentTxt} />

                <div className="flex flex-col items-center">
                    <Button
                        onClick={handleLike}
                        variant={liked ? "default" : "outline"}
                        size="lg"
                        className="flex items-center gap-3 px-6 py-3 transition-all hover:scale-105 w-full"
                    >
                        <ThumbsUp className={`h-5 w-5 transition-all ${liked ? "fill-current" : ""}`} />
                        <span className="font-semibold">{liked ? likedText : unlikedText}</span>
                        <span className="ml-1 text-sm opacity-80">{likeSize}</span>
                    </Button>
                </div>
            </nav>
        </>
    )
}

export function StatTile({ icon, text }: { icon: ReactElement, text: string}) {
    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {React.cloneElement(icon, {
                ...(icon.props as any),
                className: "w-3.5 h-3.5",
            })}
            {text}
        </div>
    )
}