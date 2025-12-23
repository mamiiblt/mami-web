"use client"

import { Button } from "@/components/ui/button"
import { ThumbsUp, Clock, Eye, MessageCircle, Hash } from "lucide-react"
import { motion } from "framer-motion"

interface MobileStatsProps {
    readingTime: string
    topic: string
    views: string
    comments: string
    likeSize: number
    liked: boolean
    onLikeToggle: () => void
    likedText: string
    unlikedText: string
}

export function MobileStats({
                                readingTime,
                                topic,
                                views,
                                comments,
                                likeSize,
                                liked,
                                onLikeToggle,
                                likedText,
                                unlikedText,
                            }: MobileStatsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:hidden my-8 space-y-4"
        >
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{readingTime}</span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <Hash className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{topic}</span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <Eye className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{views}</span>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{comments}</span>
                </div>
            </div>

            <Button
                onClick={onLikeToggle}
                variant={liked ? "default" : "outline"}
                size="lg"
                className="w-full flex items-center justify-center gap-2.5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <ThumbsUp className={`h-5 w-5 transition-all ${liked ? "fill-current" : ""}`} />
                <span className="font-semibold">{liked ? likedText : unlikedText}</span>
                <span className="ml-1 text-sm opacity-80">({likeSize})</span>
            </Button>
        </motion.div>
    )
}
