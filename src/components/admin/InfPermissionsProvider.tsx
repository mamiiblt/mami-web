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
