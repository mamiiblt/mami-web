/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

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
