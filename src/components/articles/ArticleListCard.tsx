import {motion} from "framer-motion";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {ArrowUpRight, Calendar, Clock, EyeIcon, TagIcon} from "lucide-react";
import React from "react";

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


export default function ArticleListCard(
    {
        idx,
        bannerSrc,
        bannerAlt,
        topic,
        title,
        desc,
        dateIso,
        dateLng,
        viewCount
    }: {
        idx: number,
        bannerSrc: string,
        bannerAlt: string,
        topic: string,
        title: string,
        desc: string,
        dateIso: string,
        dateLng: string,
        viewCount: number
    }) {
    return (
        <motion.div variants={itemVariants} custom={idx}>
            <Card
                className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border hover:border-primary/30 relative">
                <div className="relative w-full h-48 overflow-hidden bg-secondary">
                    <Image
                        src={bannerSrc}
                        alt={bannerAlt}
                        fill
                        className="object-cover transition-transform duration-300"
                    />
                </div>

                <div
                    className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full opacity-70 hover:opacity-100">
                    <span className="flex items-center gap-1.5">
                        <EyeIcon className="h-3.5 w-3.5"/>
                        {viewCount}
                    </span>
                </div>

                <div className="p-6">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-balance leading-snug">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                {desc}
                            </p>
                        </div>

                        <div className="mt-3 space-y-4">
                            <div
                                className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                                <div className="flex flex-wrap items-center gap-4">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Calendar className="h-3.5 w-3.5"/>
                                                                        {new Date(dateIso).toLocaleDateString(dateLng, {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        })}
                                                                    </span>
                                    <span className="flex items-center gap-1.5">
                                                                        <TagIcon className="h-3.5 w-3.5"/>
                                        {topic}
                                                                    </span>
                                </div>
                                <ArrowUpRight
                                    className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}