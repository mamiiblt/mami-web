"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {PermissionsProvider} from "@/components/admin/InfPermissionsProvider";

export default function LayoutShell({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith("/admin")

    return (
        <>
            {!isAdmin && <Navbar />}
            {isAdmin ?
                <PermissionsProvider>
                    <main className="flex-1">
                        {children}
                    </main>
                </PermissionsProvider> :
                <main className="flex-1">
                    {children}
                </main>
            }
            {!isAdmin && <Footer />}
        </>
    )
}
