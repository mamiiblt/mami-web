'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {ExternalLink} from 'lucide-react'
import Image from 'next/image'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent, DialogTitle,
} from '@/components/ui/dialog'
import {CurrentTrack} from "@/components/about/ProfileCard";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {TFunction} from "i18next";
import {GithubIcon, SpotifyIcon} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";

interface SpotifyInfoDialogProps {
    song: CurrentTrack
    isOpen: boolean
    isPlaying: boolean
    onOpenChange: (open: boolean) => void
    t: TFunction
}

export function SpotifyInfoDialog({song, isOpen, isPlaying, onOpenChange, t}: SpotifyInfoDialogProps) {
    return (
        <>
            {isPlaying && <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                <DialogContent className="max-w-sm border-1 bg-card rounded-xl backdrop-blur-sm" onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}>
                    <VisuallyHidden>
                        <DialogTitle />
                    </VisuallyHidden>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <motion.div
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3, delay: 0.1}}
                            className="rounded-lg overflow-hidden"
                        >
                            <Image
                                src={song.image || "/placeholder.svg"}
                                alt={song.album}
                                width={240}
                                height={240}
                                className="w-60 h-60 object-cover"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3, delay: 0.1}}
                            className="text-center w-full px-4"
                        >
                            <h2 className="text-xl font-semibold text-foreground line-clamp-2">
                                {song.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {song.artist}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, delay: 0.2}}
                            className="w-full px-4"
                        >
                            <a href={song.external_url} target="_blank" rel="noopener noreferrer" className="block">
                                <Button variant={"default"} className="w-full bg-green-500 hover:bg-green-600 transition-colors">
                                    <HugeiconsIcon icon={SpotifyIcon} className="h-4 w-4"/>
                                    {t("spotify.open")}
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </DialogContent>
            </Dialog>
            }
        </>
    )
}
