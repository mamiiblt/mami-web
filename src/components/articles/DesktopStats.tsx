"use client"

import React, {ReactElement} from "react"
import {ClockIcon, MessageCircle, TagIcon, ThumbsUpIcon} from "lucide-react";
import {LikeButtonProps} from "@/components/articles/LikeButton";
import {ShareButton} from "@/components/articles/ShareButton";

interface DesktopStatsProps {
    publishTxt: string,
    topicTxt: string,
    commentTxt: string,
    contentTitle: string,
    likeTxt: string,
    likeButton: React.ReactElement<LikeButtonProps>
}

export function DesktopStats({publishTxt, topicTxt, commentTxt, likeTxt, contentTitle, likeButton}: DesktopStatsProps) {
    return (
        <>
            <p className="text-sm font-semibold text-foreground mb-4">{contentTitle}</p>
            <nav className="space-y-2">
                <StatTile icon={<ClockIcon />} text={publishTxt} />
                <StatTile icon={<TagIcon />} text={topicTxt} />
                <StatTile icon={<MessageCircle />} text={commentTxt} />
                <StatTile icon={<ThumbsUpIcon />} text={likeTxt} />

                <div className="flex flex-col items-center">
                    {React.cloneElement(likeButton, {
                        className: "flex items-center gap-3 px-6 py-3 transition-all hover:scale-105 w-full",
                    })}
                </div>

                <ShareButton className={"flex items-center gap-3 px-6 py-3 transition-all hover:scale-105 w-full"} />
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