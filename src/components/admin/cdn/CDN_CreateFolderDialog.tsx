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
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ContentInterface} from "@/app/admin/dashboard/admin/cdn-file-manager/page";

interface DialogInterfaceProps {
    router: AppRouterInstance
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    path: string
    setContents: React.Dispatch<React.SetStateAction<ContentInterface[]>>
}

export default function CDN_CreateFolderDialog(
    {
        isDialogOpen,
        setIsDialogOpen,
        path,
        router,
        setContents
    }: DialogInterfaceProps
) {
    const [createFolderName, setCreateFolderName] = useState("")

    const handleCreateFolder = async () => {
        await sendAdminRequest({
            router,
            redirectToLogin: false,
            method: "POST",
            path: "content/cdn_create_folder",
            body: JSON.stringify({
                path: path,
                name: createFolderName,
            }),
            onResponse: (response, status, data) => {
                if (status === ResponseStatus.SUCCESS) {
                    toast.success("Folder Created Successfully", {description: data.msg})

                    const newFolder: ContentInterface = {
                        name: createFolderName,
                        type: "directory",
                        modifiedAt: new Date().toISOString(),
                    }
                    setContents((prev) => (prev ? [...prev, newFolder] : [newFolder]))
                    setIsDialogOpen(false)
                    setCreateFolderName("")
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
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Create a new folder in current directory.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor={"folderName"}>Folder Name</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="folderName"
                                placeholder="Example Folder"
                                value={createFolderName}
                                onChange={(e) => setCreateFolderName(e.target.value)}
                                onKeyPress={async (e) => {
                                    if (e.key === "Enter") await handleCreateFolder()
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
                    <Button onClick={handleCreateFolder} disabled={!createFolderName.trim()}>
                        Create Folder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}