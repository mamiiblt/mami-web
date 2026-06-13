/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {ExternalLink} from 'lucide-react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import {TFunction} from "i18next"
import {useMemo} from "react"
import {HugeiconsIcon} from "@hugeicons/react";
import {HistoryFreeIcons} from "@hugeicons/core-free-icons";

interface SpotifyInfoDialogProps {
    lastPlayedSongsRaw: any[]
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    t: TFunction
}

function getRelativeTime(dateString: string, t: TFunction): string {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return t("spotify.last.time.just_now")
    if (seconds < 3600) return t("spotify.last.time.m_ago", {value: Math.floor(seconds / 60)})
    if (seconds < 86400) return t("spotify.last.time.h_ago", {value: Math.floor(seconds / 3600)})
    if (seconds < 604800) return t("spotify.last.time.d_ago", {value: Math.floor(seconds / 86400)})
    return date.toLocaleDateString('en-US')
}

export function SpotifyLastPlayedSongsInfoDialog({
                                                     isOpen,
                                                     onOpenChange,
                                                     t,
                                                     lastPlayedSongsRaw
                                                 }: SpotifyInfoDialogProps) {
    const lastPlayedSongs = useMemo(() => {
        if (!lastPlayedSongsRaw) return []
        const seenIds = new Set<string>()
        return lastPlayedSongsRaw
            .map(song => ({
                played_at: song.played_at,
                id: song.track.id,
                title: song.track.name,
                artists: song.track.artists.map((a: any) => a.name).join(", "),
                song_url: song.track.external_urls.spotify,
                image: song.track.album.images[0]?.url,
            }))
            .filter(song => {
                if (seenIds.has(song.id)) return false
                seenIds.add(song.id)
                return true
            })
    }, [lastPlayedSongsRaw])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 z-40 bg-card/20 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
            <DialogContent
                className="max-w-sm border-1 bg-card rounded-xl backdrop-blur-sm max-h-[80vh] overflow-y-auto"
                onOpenAutoFocus={(e) => e.preventDefault()}
                aria-describedby="spotify-songs-list"
            >
                <DialogTitle className={"flex items-center gap-2"}>
                    <HugeiconsIcon icon={HistoryFreeIcons} />
                    {t("spotify.last.title")}
                </DialogTitle>

                <div className="space-y-2" id="spotify-songs-list">
                    {lastPlayedSongs.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center"></p>
                    ) : (
                        lastPlayedSongs.map((song, index) => (
                            <motion.a
                                key={`${song.id}-${song.played_at}`}
                                href={song.song_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: index * 0.05}}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                            >
                                {song.image && (
                                    <div className="relative flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                                        <Image
                                            src={song.image}
                                            alt={song.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                        {song.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {song.artists}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                        {getRelativeTime(song.played_at, t)}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink size={16} className="text-muted-foreground"/>
                                </div>
                            </motion.a>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}