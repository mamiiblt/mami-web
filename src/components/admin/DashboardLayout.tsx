"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Home,
    Menu,
    X,
    ChevronDown, PackageMinusIcon, SquaresExcludeIcon, UserRoundSearchIcon, CloudDownloadIcon, FileUp, NewspaperIcon,
    MessageCircleIcon, ScrollText, RotateCcwIcon, LucideIcon, CircleUserRoundIcon, BoltIcon, LogOut
} from "lucide-react"
import {LoadingBar} from "@/components/ifl";
import {getSavedSessionToken, logoutUser, sendAdminRequest} from "@/lib/adminUtils";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {League_Spartan} from "next/font/google";

const leagueSpartan = League_Spartan({
    subsets: ["latin"],
    weight: ["600"],
});


interface AdminData {
    id: number
    fullname: string
    username: string
    pp_url: string
}

export function DashboardLayout({ children, title, description, pageIcon: Icon }: { pageIcon: LucideIcon, children: React.ReactNode, title: string, description: string }) {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["website", "instafel", "api"])
    const [isLoading, setIsLoading] = useState(true)
    const [adminData, setAdminData] = useState<AdminData | undefined>(undefined)

    useEffect(() => {
        try {

            async function sendRequest() {
                const data: AdminData = await sendAdminRequest(getSavedSessionToken(router), {
                    method: "GET",
                    path: "content/admin_basic_info"
                })

                setAdminData(data)
                setIsLoading(false)
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
        { icon: Home, label: "Home", href: "/admin/dashboard" },
        { icon: CircleUserRoundIcon, label: "My Profile", href: "/admin/dashboard/my-profile" }
    ]

    const menuCategories = [
        {
            id: "instafel",
            label: "Instafel",
            items: [
                { icon: FileUp, label: "Update Backup", href: "/admin/dashboard/instafel/update-backup" },
                { icon: PackageMinusIcon, label: "Rollback Release", href: "/admin/dashboard/instafel/delete-release" },
                { icon: SquaresExcludeIcon, label: "Trigger Patcher", href: "/admin/dashboard/instafel/trigger-patcher" },
                { icon: CloudDownloadIcon, label: "Merge Translations", href: "/admin/dashboard/instafel/merge-translations" },
                { icon: UserRoundSearchIcon, label: "Reload Crowdin List", href: "/admin/dashboard/instafel/rl-crowdin-list" },
            ],
        },
        {
            id: "website",
            label: "mamii's website",
            items: [
                { icon: MessageCircleIcon, label: "Comments", href: "/admin/dashboard/mami-web/comments" },
                { icon: NewspaperIcon, label: "Articles", href: "/admin/dashboard/mami-web/articles" },
            ],
        },
        {
            id: "api",
            label: "API",
            items: [
                { icon: ScrollText, label: "Audit Logs", href: "/admin/dashboard/api/audit-logs" },
                { icon: RotateCcwIcon, label: "Restart API", href: "/admin/dashboard/api/restart-api" },
            ],
        },
    ]

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )
    }

    return (
        isLoading ?  <LoadingBar /> : <div className="flex h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside
                className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pt-6 pl-6 pr-6 pb-5 border-b border-border">
                        <div className="flex items-center gap-2">
                            <span className={`font-bold text-3xl ${leagueSpartan.className}`}>MAdmin</span>
                        </div>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="size-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">

                            <div className="space-y-1">
                                {mainCategories.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <item.icon className="size-4" />
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
                                                        <item.icon className="size-4" />
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

                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
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
                                <LogOut className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b border-border bg-card flex items-center px-6">
                    <Button variant="ghost" size="icon" className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
                        <Menu className="size-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-5 h-5" />
                            <p className="font-semibold">{title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-background min-h-0">{children}</main>
            </div>
        </div>
    )
}
