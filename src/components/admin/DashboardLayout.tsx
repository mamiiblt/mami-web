"use client"

import React, {useEffect, useRef} from "react"

import {useState} from "react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {
    Home,
    Menu,
    X,
    ChevronDown, PackageMinusIcon, SquaresExcludeIcon, UserRoundSearchIcon, CloudDownloadIcon, FileUp, NewspaperIcon,
    MessageCircleIcon, ScrollText, RotateCcwIcon, LucideIcon, CircleUserRoundIcon, LogOut,
    MonitorIcon, UserCogIcon, CogIcon
} from "lucide-react"
import {LoadingBar} from "@/components/ifl";
import {getSavedSessionToken, getSessionExpireDate, logoutUser, sendAdminRequest} from "@/lib/adminUtils";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Barlow_Condensed, Bayon} from "next/font/google";
import {toast} from "sonner";

export const bayon = Barlow_Condensed({
    weight: "700"
});

interface AdminData {
    id: number
    fullname: string
    username: string
    pp_url: string
}

export function DashboardLayout({children, title, description, pageIcon: Icon, actionBarItems = [], loadingState}: {
    pageIcon: LucideIcon,
    children: React.ReactNode,
    title: string,
    description: string,
    loadingState: boolean,
    actionBarItems?: React.ReactNode[]
}) {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["website", "instafel", "admin"])
    const [isLoading, setIsLoading] = useState(true)
    const [adminData, setAdminData] = useState<AdminData | undefined>(undefined)
    const [remainingTime, setRemainingTime] = useState("00:00:00")
    const [showWarning, setShowWarning] = useState(false)

    const mountedAtRef = useRef<number>(Date.now())
    const expiredRef = useRef(false)

    useEffect(() => {
        const updateTimer = () => {
            const sessionExpireTime = getSessionExpireDate()
            if (!sessionExpireTime) {
                handleExpired()
                return
            }

            const now = Date.now()
            const diff = sessionExpireTime.getTime() - now

            const TWENTY_MINUTES = 20 * 60 * 1000
            const FORCE_SHOW_DURATION = 3000 // 3 sn

            if (now - mountedAtRef.current < FORCE_SHOW_DURATION) {
                setShowWarning(true)
            }
            else {
                setShowWarning(diff <= TWENTY_MINUTES)
            }

            if (diff <= 0) {
                handleExpired()
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setRemainingTime(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            )
        }

        const handleExpired = () => {
            if (expiredRef.current) return
            expiredRef.current = true

            setRemainingTime("Session expired")

            toast.info("Session Expired", {
                description: "Your session has expired, please re-login.",
                action: {
                    label: "Login",
                    onClick: () => router.push("/admin/login"),
                },
            })
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [router])


    useEffect(() => {
        try {

            async function sendRequest() {
                await sendAdminRequest(getSavedSessionToken(router), {
                    method: "GET",
                    path: "content/admin_basic_info",
                    onResponse: (response, status, data) => {
                        setAdminData(data.content)
                        setIsLoading(false)
                    }
                })
            }

            sendRequest()
        } catch (e) {
            console.error(e)
        }
    }, []);

    const mainCategories: {
        icon: LucideIcon,
        label: string,
        href: string
    }[] = [
        {icon: Home, label: "Home", href: "/admin/dashboard"},
        {icon: CircleUserRoundIcon, label: "My Profile", href: "/admin/dashboard/my-profile"},
        {icon: CogIcon, label: "Settings", href: "/admin/dashboard/settings"}
    ]

    const menuCategories = [
        {
            id: "instafel",
            label: "Instafel",
            items: [
                {icon: FileUp, label: "Update Backup", href: "/admin/dashboard/instafel/update-backup"},
                {icon: PackageMinusIcon, label: "Rollback Release", href: "/admin/dashboard/instafel/delete-release"},
                {icon: SquaresExcludeIcon, label: "Trigger Patcher", href: "/admin/dashboard/instafel/trigger-patcher"},
                {
                    icon: CloudDownloadIcon,
                    label: "Merge Translations",
                    href: "/admin/dashboard/instafel/merge-translations"
                },
                {
                    icon: UserRoundSearchIcon,
                    label: "Reload Crowdin List",
                    href: "/admin/dashboard/instafel/rl-crowdin-list"
                },
            ],
        },
        {
            id: "website",
            label: "mamii's website",
            items: [
                {icon: MessageCircleIcon, label: "Comments", href: "/admin/dashboard/mami-web/comments"},
                {icon: NewspaperIcon, label: "Articles", href: "/admin/dashboard/mami-web/articles"},
            ],
        },
        {
            id: "admin",
            label: "Admin",
            items: [
                {icon: MonitorIcon, label: "Service Monitor", href: "/admin/dashboard/admin/service-monitor"},
                {icon: UserCogIcon, label: "Member Management", href: "/admin/dashboard/admin/member-management"},
                {icon: ScrollText, label: "API - Audit Logs", href: "/admin/dashboard/admin/audit-logs"},
                {icon: RotateCcwIcon, label: "API - Restart", href: "/admin/dashboard/admin/restart-api"},
            ],
        }
    ]

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    return (
        isLoading ? <LoadingBar/> : <div className="flex h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
            )}

            <aside
                className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-65 bg-card border rounded-xl border-border
        transform transition-transform duration-200 ease-in-out ml-4 mt-4 mb-4
        ${sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+16px)] lg:translate-x-0"}
      `}
            >
                <div className="flex flex-col h-full">

                    <div className="flex items-center justify-between h-20 pt-6 pl-6 pr-6 pb-5 border-b border-border">
                        <div className="flex-1 flex items-center justify-center">
    <span className={`font-bold text-center text-3xl ${bayon.className}`}>
      MAdmin Dashboard
    </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="size-5"/>
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto hide-scrollbar">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                {mainCategories.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <item.icon className="size-4"/>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {menuCategories.map((category) => (
                                <div key={category.id}>
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <span>{category.label}</span>
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-200 ${
                                                expandedCategories.includes(category.id) ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {expandedCategories.includes(category.id) && (
                                        <ul className="mt-1 space-y-1">
                                            {category.items.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                                    >
                                                        <item.icon className="size-4"/>
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </nav>

                    {showWarning && <div className="px-4 py-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Left session time:</span>
                            <span className="font-mono font-semibold text-foreground">{remainingTime}</span>
                        </div>
                    </div>
                    }

                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <Avatar
                                className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                <AvatarImage src={adminData.pp_url} alt={adminData.fullname}/>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{adminData.fullname}</p>
                                <p className="text-xs text-muted-foreground truncate">{"@" + adminData.username}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => {
                                    logoutUser(router)
                                }}
                            >
                                <LogOut className="size-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                {loadingState ? <LoadingBar/> : (
                    <div className="flex flex-col h-screen">
                        <header className="sticky top-4 z-40 mb-4">
                            <div
                                className="lg:h-20 border rounded-xl border-border bg-card flex flex-col md:flex-row md:items-center px-6 ml-4 mr-4 gap-4">
                                <div className="hidden lg:block">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className="w-6 h-6"/>
                                        <p className="font-semibold">{title}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                </div>
                                <div className="mt-4 pb-4 flex flex-col sm:flex-row gap-2 md:ml-auto">
                                    {actionBarItems.map((component, index) => (
                                        <React.Fragment key={index}>{component}</React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </header>

                        <div
                            className={`flex-1 m-4 overflow-y-auto bg-background sticky bottom-4 border-t border-b rounded-xl hide-scrollbar`}>
                            {children}

                            {
                                !sidebarOpen && <Button
                                    className="fixed bottom-6 right-6 size-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 lg:hidden"
                                    size="icon"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="size-6"/>
                                </Button>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
