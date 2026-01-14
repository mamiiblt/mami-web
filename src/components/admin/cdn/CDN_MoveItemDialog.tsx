import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DialogInterfaceProps {
    router: AppRouterInstance
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setReloadState: React.Dispatch<React.SetStateAction<boolean>>

    moveDialogOldPath: string
    setMoveDialogOldPath: React.Dispatch<React.SetStateAction<string>>
    moveDialogNewPath: string
    setMoveDialogNewPath: React.Dispatch<React.SetStateAction<string>>
}

export default function CDN_MoveItemDialog(
    {
        isDialogOpen,
        setIsDialogOpen,
        router,
        setReloadState,
        moveDialogOldPath,
        moveDialogNewPath,
        setMoveDialogOldPath,
        setMoveDialogNewPath
    }: DialogInterfaceProps
) {
    const handleMoveItem = async () => {
        await sendAdminRequest({
            router,
            redirectToLogin: false,
            method: "POST",
            path: "content/cdn_move",
            body: JSON.stringify({
                oldPath: moveDialogOldPath,
                newPath: moveDialogNewPath
            }),
            onResponse: (response, status, data) => {
                if (status === ResponseStatus.SUCCESS) {
                    toast.success("Item Moved Successfully", {description: data.msg})
                    setReloadState(prevState => !prevState)
                    setIsDialogOpen(false)
                    setMoveDialogNewPath("")
                    setMoveDialogOldPath("")
                } else {
                    toast.error(status, {description: data.msg})
                }
            }
        })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Move Item</DialogTitle>
                    <DialogDescription>Move a existing folder / file to a specific path.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor={"oldPath"}>Old Item Path</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="oldPath"
                                placeholder="/..."
                                value={moveDialogOldPath}
                                disabled
                                className="flex-1"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={"newPath"}>New Item Path</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="newPath"
                                placeholder="/..."
                                value={moveDialogNewPath}
                                onChange={(e) => setMoveDialogNewPath(e.target.value)}
                                onKeyPress={async (e) => {
                                    if (e.key === "Enter") await handleMoveItem()
                                }}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleMoveItem} disabled={!moveDialogNewPath.trim()}>
                        Move Folder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}