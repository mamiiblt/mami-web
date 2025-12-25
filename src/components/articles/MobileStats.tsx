"use client"

import {Clock, MessageCircle, ThumbsUpIcon, Tag} from "lucide-react"
import { motion } from "framer-motion"
import React, {ReactElement} from "react";
import {LikeButtonProps} from "@/components/articles/LikeButton";

interface MobileStatsProps {
    publishTxt: string
    topicTxt: string
    commentTxt: string
    likeTxt: string
    likeButton: React.ReactElement<LikeButtonProps>
}

export function MobileStats({publishTxt, topicTxt, commentTxt, likeTxt, likeButton}: MobileStatsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:hidden my-8 space-y-4"
        >
            <div className="grid grid-cols-2 gap-3">
                <StatTile icon={<Clock />} text={publishTxt} />
                <StatTile icon={<Tag />} text={topicTxt} />
                <StatTile icon={<MessageCircle />} text={commentTxt} />
                <StatTile icon={<ThumbsUpIcon />} text={likeTxt} />
            </div>

            {React.cloneElement(likeButton, {
                className: "w-full flex items-center justify-center gap-2.5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]",
            })}
        </motion.div>
    )
}

export function StatTile({ icon, text }: { icon: ReactElement, text: string}) {
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                {React.cloneElement(icon, {
                ...(icon.props as any),
                className: "h-4 w-4 text-primary flex-shrink-0",
            })}
            <span className="text-sm text-muted-foreground">{text}</span>
        </div>
    )
}
