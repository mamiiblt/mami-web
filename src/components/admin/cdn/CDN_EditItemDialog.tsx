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
import {FileUp, Upload} from "lucide-react";
import {usePathname} from "next/navigation";

interface DialogInterfaceProps {
    router: AppRouterInstance
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    editFilePath: string
    setEditFilePath: React.Dispatch<React.SetStateAction<string>>
    editFileContent: string
    setEditFileContent: React.Dispatch<React.SetStateAction<string>>
}

export default function CDN_EditItemDialog(
    {
        isDialogOpen,
        setIsDialogOpen,
        router,
        editFilePath,
        setEditFilePath,
        editFileContent,
        setEditFileContent
    }: DialogInterfaceProps
) {
    const pathname = usePathname()

    const handleFileEdit = async () => {
        await sendAdminRequest({
            router, pathname,
            redirectToLogin: false,
            method: "POST",
            path: "content/cdn_edit_file",
            body: JSON.stringify({
                path: editFilePath,
                newContent: editFileContent,
            }),
            onResponse: (response, status, data) => {
                if (status === ResponseStatus.SUCCESS) {
                    toast.success("Changes Applied Successfully", {description: data.msg})
                    setIsDialogOpen(false)
                    setEditFilePath("")
                    setEditFileContent("")
                } else {
                    toast.error(status, {description: data.msg})
                }
            }
        })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className={"min-w-[700px]"}>
                <DialogHeader>
                    <DialogTitle>Edit File <a className={"text-muted-foreground"}>(Text Binary)</a></DialogTitle>
                    <DialogDescription>Edit TEXT files directly from here</DialogDescription>
                </DialogHeader>

                <div>
                    <div className="grid gap-2 ">
                        <Textarea
                            id="content"
                            placeholder="Write file content to here..."
                            value={editFileContent}
                            onChange={(e) => setEditFileContent(e.target.value)}
                            className="min-h-[500px] resize-none font-mono text-sm"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Discard
                    </Button>
                    <Button onClick={handleFileEdit} disabled={editFileContent.length === 0}>
                        <Upload className="h-4 w-4"/>
                        Apply Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export async function loadCdnFileContent(url: string){
    try {
        const response = await fetch(url, { cache: "no-cache" });
        const arrayBuffer = await response.arrayBuffer();

        const uint8 = new Uint8Array(arrayBuffer);

        const isText = isTextBuffer(uint8);

        if (isText) {
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(uint8);
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

function isTextBuffer(buffer: Uint8Array, sampleSize = 2048) {
    const sample = buffer.subarray(0, sampleSize);

    for (let i = 0; i < sample.length; i++) {
        if (sample[i] === 0) return false;
    }

    return true;
}