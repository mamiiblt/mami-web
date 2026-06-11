import {useEffect, useState} from "react";
import {TFunction} from "i18next";
import { motion} from "framer-motion";
import Image from "next/image";
import {HugeiconsIcon} from "@hugeicons/react";
import {HistoryIcon, MusicNote02Icon, PlayIcon, PlaylistIcon} from "@hugeicons/core-free-icons";
import Link from "next/link";
import {containerVariants, itemVariants, profileVariants, socialButtonVariants} from "@/components/about/MotionSpecs";
import {Button} from "@/components/ui/button";
import {SpotifyCurrentPlayingInfoDialog} from "@/components/about/SpotifyCurrentPlayingInfoDialog";
import {SpotifyLastPlayedSongsInfoDialog} from "@/components/about/SpotifyLastPlayedSongsInfoDialog";

export interface CurrentTrack {
    name: string;
    artist: string;
    album: string;
    image: string;
    external_url: string;
}

function useSpotifyCurrentTrack() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
    const [listLastTracks, setListLastTracks] = useState(false);
    const [lastTracks, setLastTracks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentTrack = async () => {
            try {
                const response = await fetch("/api/spotify/current-track");

                if (response.ok) {
                    const data = await response.json();
                    if (data.type == "currently-playing" && data.resp.is_playing) {
                        setCurrentTrack({
                            name: data.resp.item.name,
                            artist: data.resp.item.artists.map((artist) => artist.name).join(", "),
                            album: data.resp.item.album.name,
                            image: data.resp.item.album.images[0]?.url,
                            external_url: data.resp.item.external_urls.spotify,
                        } as CurrentTrack);

                        setIsPlaying(data.resp.is_playing);
                        setListLastTracks(false)
                        setLastTracks(null)
                    }

                    if (data.type == "recently-played") {
                        setListLastTracks(true);
                        setLastTracks(data.resp);
                    }
                }
            } catch (error) {
                console.error("Spotify API error:", error);
                setCurrentTrack(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentTrack();

        const interval = setInterval(fetchCurrentTrack, 30000);

        return () => clearInterval(interval);
    }, []);

    return {currentTrack, isPlaying, loading, listLastTracks, lastTracks};
}

const MotionButton = motion.create(Button);

export function ProfileCard({socialLinks, t}: { socialLinks: any; t: TFunction; }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const {currentTrack, isPlaying, listLastTracks, lastTracks} = useSpotifyCurrentTrack();
    const [activeDialog, setActiveDialog] = useState<"current" | "recent" | null>(null);

    return (
        <motion.div
            className="flex flex-col items-center w-full max-w-2xl"
            variants={{
                hidden: {opacity: 0, y: -20},
                visible: {opacity: 1, y: 0},
            }}
        >
            <SpotifyCurrentPlayingInfoDialog
                song={currentTrack}
                isPlaying={isPlaying}
                isOpen={activeDialog === "current"}
                onOpenChange={(v) => !v && setActiveDialog(null)}
                t={t}
            />

            <SpotifyLastPlayedSongsInfoDialog
                lastPlayedSongsRaw={lastTracks}
                isOpen={activeDialog === "recent"}
                onOpenChange={(v) => !v && setActiveDialog(null)}
                t={t}
            />

            <motion.div
                className={`relative mb-4 h-[180px] w-[180px] ${
                    currentTrack && isPlaying ? "animate-pulse-ring" : ""
                }`}
                variants={profileVariants}
                onClick={() => {
                    if (isPlaying && currentTrack) {
                        setActiveDialog("current");
                    } else if (listLastTracks) {
                        setActiveDialog("recent");
                    }
                }}
                whileHover="hover"
            >
                {currentTrack && isPlaying && (
                   <>
                       <motion.div
                           className="absolute inset-0 rounded-4xl border-2 border-green-500 opacity-50"
                           animate={{
                               scale: [1, 1.15, 1],
                               opacity: [0.5, 0.2, 0.5],
                           }}
                           transition={{
                               duration: 2,
                               repeat: Number.POSITIVE_INFINITY,
                           }}
                       />
                   </>
                )}

                <div
                    className={`relative h-full w-full overflow-hidden rounded-4xl ${!currentTrack && !isPlaying ? "border-3 border-border" : ""} ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Image
                        src="/mamiiblt.png"
                        alt={t("profile.photo")}
                        width={180}
                        height={180}
                        className="h-full w-full object-cover"
                        priority
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                {isPlaying && (
                    <motion.div
                        className="absolute -bottom-2 -right-2 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div
                            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                            transition={{
                                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                                duration: 1.5,
                            }}
                        >
                            <HugeiconsIcon icon={PlayIcon} className="h-3 w-3" />
                        </motion.div>
                        <span>{t("spotify.playing")}</span>
                    </motion.div>
                )}

                {listLastTracks && (
                    <motion.div
                        className="absolute -bottom-2 -right-2 flex items-center bg-secondary gap-2 text-foreground border-b px-3 py-1 rounded-full shadow-lg text-xs font-semibold"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div
                            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                            transition={{
                                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                                duration: 1.5,
                            }}
                        >
                            <HugeiconsIcon icon={HistoryIcon} className="h-4 w-4 text-foreground" />
                        </motion.div>
                        <span>{t("spotify.listened")}</span>
                    </motion.div>
                )}
            </motion.div>

            <motion.h1
                className="mb-1 text-2xl font-bold tracking-tight"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                    },
                }}
            >
                {t("profile.name")}
            </motion.h1>

            <motion.p
                className="mb-4 text-base font-light tracking-wide text-muted-foreground"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 300, damping: 24 },
                    },
                }}
            >
                {t("profile.subtitle")}
            </motion.p>

            <motion.div
                className={`${isPlaying ? "mb-4" : "mb-8"} flex flex-wrap justify-center gap-3`}
                variants={containerVariants}
            >
                {socialLinks.map((link, index) => (
                    <motion.div key={index} variants={itemVariants} custom={index}>
                        <MotionButton
                            variant="outline"
                            size="icon"
                            asChild
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            variants={socialButtonVariants}
                        >
                            <Link
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.icon}
                            </Link>
                        </MotionButton>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}