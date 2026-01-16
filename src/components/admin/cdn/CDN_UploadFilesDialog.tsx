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
import React, {useRef, useState} from "react";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ContentInterface} from "@/app/admin/dashboard/admin/cdn-file-manager/page";
import {File, FileUp, Folder, Grid2X2, HardDriveIcon, RefreshCcw, Search, Upload, X} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {formatFileSize} from "@/lib/utils";
import {usePathname} from "next/navigation";

interface DialogInterfaceProps {
    router: AppRouterInstance
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    path: string
    setReloadState: React.Dispatch<React.SetStateAction<boolean>>
}

interface SelectedFileInfo {
    file: File,
    uploadStatus: "UPLOADED" | "WAITING" | "FAILED"
}

export default function CDN_UploadFilesDialog(
    {
        isDialogOpen,
        setIsDialogOpen,
        path,
        router,
        setReloadState
    }: DialogInterfaceProps
) {
    const pathname = usePathname()
    const [selectedFiles, setSelectedFiles] = useState<SelectedFileInfo[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleOpenFileDialog = () => fileInputRef.current?.click()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            const files = filesArray.map(file => ({
                file: file,
                uploadStatus: "WAITING"
            } as SelectedFileInfo))
            setSelectedFiles((prev) => [...prev, ...files])
        }
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {

        const setSelectedFileStatus = (selectedFile: File, status: string) => {
            setSelectedFiles(prev =>
                prev.map(item =>
                    item.file.name === selectedFile.name
                        ? {...item, uploadStatus: status as "WAITING" | "UPLOADED" | "FAILED"}
                        : item
                )
            )
        }
        if (selectedFiles.length === 0) return

        setIsUploading(true)

        try {
            await Promise.all(
                selectedFiles.map(async (selectedInfo) => {
                    console.log(`Uploading file: ${selectedInfo.file.name}`)

                    const formData = new FormData()
                    formData.append("file", selectedInfo.file)
                    formData.append("current_dir", `${path}/${selectedInfo.file.name}`)

                    await sendAdminRequest({
                        router, pathname,
                        redirectToLogin: false,
                        method: "POST",
                        path: "content/cdn_upload",
                        body: formData,
                        onResponse: (response, status, data) => {
                            if (status === ResponseStatus.FAILURE) {
                                toast.error(
                                    `An error occurred while uploading ${selectedInfo.file.name}`,
                                    {description: data.msg}
                                )
                                setSelectedFileStatus(selectedInfo.file, "FAILED")
                            } else {
                                setSelectedFileStatus(selectedInfo.file, "UPLOADED")
                            }
                        }
                    })
                })
            )
        } catch (err) {
            console.error(err)
        } finally {
            setIsUploading(false)
            setReloadState(prev => !prev)
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
            setSelectedFiles([])
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>Select some files to upload into current directory.</DialogDescription>
                </DialogHeader>

                <div className="py-4">

                    {!isUploading && <>
                        <div
                            onClick={handleOpenFileDialog}
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
                        >
                            <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-3"/>
                            <p className="text-sm font-medium">Click to select file(s)</p>
                            <p className="text-xs text-muted-foreground mt-1">or drag to this area</p>
                        </div>

                        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect}
                               className="hidden"/>
                    </>}

                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <p className={`text-sm font-medium text-muted-foreground ${!isUploading && "mt-4"}`}>Selected
                                Files ({selectedFiles.length})</p>
                            <div className={`max-h-[${isUploading ? 100 : 200}px] overflow-y-auto space-y-2`}>
                                {selectedFiles.map((selectedFile, index) => (
                                    <div
                                        key={`${selectedFile.file.name}-${index}`}
                                        className="flex items-center justify-between gap-3 p-2 bg-muted/50 rounded-md"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <File
                                                className={`h-4 w-4 ${getTextUploadStatusColor(selectedFile.uploadStatus)} text-blue-500 shrink-0`}/>
                                            <span className="text-sm truncate">{selectedFile.file.name}</span>
                                            <Badge
                                                className={`font-mono ${getBadgeUploadStatusColor(selectedFile.uploadStatus)}`}
                                                variant={"default"}>{selectedFile.uploadStatus}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                                <span
                                                    className="text-xs text-muted-foreground">{formatFileSize(selectedFile.file.size)}</span>
                                            {!isUploading && <Button variant="ghost" size="icon" className="h-6 w-6"
                                                                     onClick={() => handleRemoveFile(index)}>
                                                <X className="h-3 w-3"/>
                                            </Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button className={"bg-green-600 hover:bg-green-700"} onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || isUploading}>
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                                    Uploading ({`${selectedFiles.filter(item => item.uploadStatus === "UPLOADED").length}/${selectedFiles.length}`})
                                </span>
                        ) : (
                            <div
                                className={"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"}>
                                <Upload className="h-4 w-4"/>
                                Upload Files
                            </div>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function getBadgeUploadStatusColor(uploadStatus: string) {
    switch (uploadStatus) {
        case "UPLOADED":
            return "bg-green-700"
        case "WAITING":
            return "bg-blue-700"
        case "FAILED":
            return "bg-red-700"
    }
}

function getTextUploadStatusColor(uploadStatus: string) {
    switch (uploadStatus) {
        case "UPLOADED":
            return "text-green-700"
        case "WAITING":
            return "text-blue-700"
        case "FAILED":
            return "text-red-700"
    }
}
