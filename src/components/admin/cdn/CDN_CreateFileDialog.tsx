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

export default function CDN_CreateFileDialog(
    {
        isDialogOpen,
        setIsDialogOpen,
        path,
        router,
        setContents
    }: DialogInterfaceProps
) {
    const [createFilename, setCreateFilename] = useState("")
    const [createContent, setCreateContent] = useState("")

    const handleCreateFile = async () => {
        await sendAdminRequest({
            router,
            redirectToLogin: false,
            method: "POST",
            path: "content/cdn_create_file",
            body: JSON.stringify({
                path: path,
                name: createFilename,
                content: createContent
            }),
            onResponse: (response, status, data) => {
                if (status === ResponseStatus.SUCCESS) {
                    toast.success("Created Successfully", {description: data.msg})

                    const newFile: ContentInterface = {
                        name: createFilename,
                        type: "file",
                        size: new Blob([createContent]).size,
                        modifiedAt: new Date().toISOString(),
                    }
                    setContents((prev) => (prev ? [...prev, newFile] : [newFile]))
                    setIsDialogOpen(false)
                    setCreateContent("")
                    setCreateFilename("")
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
                    <DialogTitle>Create New File</DialogTitle>
                    <DialogDescription>Create a new text file by entering the file name and content.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor={"filename"}>Name <a className={"text-muted-foreground"}>(with
                            extension)</a></Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="filename"
                                placeholder="example.json"
                                value={createFilename}
                                onChange={(e) => setCreateFilename(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor={"content"}>Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write file content to here..."
                            value={createContent}
                            onChange={(e) => setCreateContent(e.target.value)}
                            className="min-h-[200px] resize-none font-mono text-sm"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFile} disabled={!createFilename.trim()}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}