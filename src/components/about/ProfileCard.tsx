import {useEffect, useState} from "react";
import {TFunction} from "i18next";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import Image from "next/image";
import {HugeiconsIcon} from "@hugeicons/react";
import {MusicNote01Icon, PlayIcon, SpotifyIcon} from "@hugeicons/core-free-icons";
import Link from "next/link";
import {containerVariants, itemVariants, profileVariants, socialButtonVariants} from "@/components/about/MotionSpecs";
import {Button} from "@/components/ui/button";

function useSpotifyCurrentTrack() {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentTrack = async () => {
            try {
                const response = await fetch("/api/spotify/current-track");

                if (response.ok) {
                    const data = await response.json();
                    if (data.is_playing && data.item) {
                        setCurrentTrack({
                            name: data.item.name,
                            artist: data.item.artists[0].name,
                            album: data.item.album.name,
                            image: data.item.album.images[0]?.url,
                            external_url: data.item.external_urls.spotify,
                            preview_url: data.item.preview_url,
                        });
                        setIsPlaying(data.is_playing);
                    } else {
                        setCurrentTrack(null);
                        setIsPlaying(false);
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

    return {currentTrack, isPlaying, loading};
}

const MotionButton = motion.create(Button);

export function ProfileCard({socialLinks, t}: { socialLinks: any; t: TFunction; }) {
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);
    const {currentTrack, isPlaying, loading} = useSpotifyCurrentTrack();

    return (
        <motion.div
            className="flex flex-col items-center w-full max-w-2xl"
            variants={{
                hidden: {opacity: 0, y: -20},
                visible: {opacity: 1, y: 0},
            }}
        >
            <motion.div
                className={`relative mb-4 h-[180px] w-[180px] ${
                    currentTrack && isPlaying ? "animate-pulse-ring" : ""
                }`}
                variants={profileVariants}
                whileHover="hover"
            >
                {currentTrack && isPlaying && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-500 opacity-50"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.5, 0.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    />
                )}

                <div
                    className={`relative h-full w-full overflow-hidden rounded-full border-2 border-border ${
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

                {currentTrack && (
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
                {t("profile.title")}
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

            {currentTrack && (
                <motion.div
                    className={`${isPlaying ? "mb-8" : "mb-4"}  w-full max-w-2xl`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div
                        onClick={() => router.push(currentTrack.external_url)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 backdrop-blur-sm"
                    >
                        <div className="relative h-10 w-10 overflow-hidden rounded flex-shrink-0">
                            {currentTrack.image ? (
                                <Image
                                    src={currentTrack.image || "/placeholder.svg"}
                                    alt={currentTrack.album}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-green-500/20 flex items-center justify-center">
                                    <HugeiconsIcon
                                        icon={MusicNote01Icon}
                                        className="h-5 w-5 text-green-500"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium truncate">
                                {currentTrack.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {currentTrack.artist}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <HugeiconsIcon
                                icon={SpotifyIcon}
                                className="h-5 w-5 text-green-500 hover:scale-110 transition-transform"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}