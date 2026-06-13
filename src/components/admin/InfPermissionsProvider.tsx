/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

"use client"

import { useEffect, useState, type ReactNode } from "react"
import {InsufficientPermissionsDialog} from "@/components/admin/InsufficientPermissionsDialog";
import {permissionsManager} from "@/lib/permissionsManager";

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [missingPermissions, setMissingPermissions] = useState<string[]>([])

    useEffect(() => {
        const unsubscribe = permissionsManager.subscribe((permissions) => {
            setMissingPermissions(permissions)
            setIsOpen(true)
        })

        return unsubscribe
    }, [])

    return (
        <>
            {children}
            <InsufficientPermissionsDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                missingPermissions={missingPermissions}
            />
        </>
    )
}
