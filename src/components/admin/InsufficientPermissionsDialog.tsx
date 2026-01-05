"use client"

import { AlertTriangle, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface InsufficientPermissionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    missingPermissions: string[]
}

export function InsufficientPermissionsDialog({open, onOpenChange, missingPermissions}: InsufficientPermissionsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="size-5 text-destructive" />
                        </div>
                        <DialogTitle>Unauthorized Access</DialogTitle>
                    </div>
                    <DialogDescription className="text-left">You do not have sufficient authorization to perform this action.</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium mb-2">Required Permissions:</p>
                        <div className="space-y-1.5">
                            {missingPermissions.map((permission) => (
                                <div key={permission} className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                                    <X className="size-4 text-destructive" />
                                    <code className="text-xs">{permission}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        If you need these permissions, please contact to mamii for get permission.
                    </p>

                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        Okay
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
