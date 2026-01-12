"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {
    ChevronRight,
    File, FileUpIcon, Folder, FolderUpIcon, Grid2X2,
    HardDriveIcon,
    Home, Pencil, RefreshCcw, Search,
    Share2,
    Trash2
} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";

interface ContentInterface {
    name: string;
    type: "file" | "directory";
    size?: any;
    modifiedAt: any;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "—"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(date: any): string {
    if (!date) return "—"
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function DashboardPage() {
    const router = useRouter()
    const [path, setPath] = useState("/");
    const [contents, setContents] = useState<ContentInterface[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [loadingContents, setLoadingContents] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [reloadState, setReloadState] = useState(false);
    const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false)
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false)
    const [createFilename, setCreateFilename] = useState("")
    const [createContent, setCreateContent] = useState("")
    const [createFolderName, setCreateFolderName] = useState("")
    const [actionMenuOpen, setActionMenuOpen] = useState(false)

    const handleOperations = {
        onNavigate: (path: string) => {
            setPath(path)
            setSearchQuery("")
        },
        onShare: (item: ContentInterface) => {
            toast.success("URL Copied", {
                description: "Raw content URL is copied to clipboard."
            })
        },
        onOpen: (path: string) => {
            window.open(`https://cdn.mamii.dev${path}`, "_blank", "noopener,noreferrer")
        },
        onDelete: async (itemPath: string, isFolder: boolean, itemName: string) => {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: "content/cdn_delete",
                body: JSON.stringify({
                    path: itemPath,
                    isFolder: isFolder,
                    itemName: itemName
                }),
                onResponse: (response, status, data) => {
                    if (status === ResponseStatus.SUCCESS) {
                        toast.success("Deleted", { description: data.msg })
                    } else {
                        toast.error(status, { description: data.msg })
                    }

                    setContents(contents.filter(item=> item.name !== itemName))
                }
            })
        },
        onRename: (item: ContentInterface) => {
            console.log("Rename:", item.name)
        }
    }

    const filteredContents = useMemo(() => {
        if (!contents) return []

        const query = searchQuery.toLowerCase()

        return contents.filter(content =>
            content.name.toLowerCase().includes(query)
        )
    }, [contents, searchQuery])

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
                    toast.success("Created Successfully", { description: data.msg })

                    const newFolder: ContentInterface = {
                        name: createFolderName,
                        type: "directory",
                        modifiedAt: new Date().toISOString(),
                    }
                    setContents((prev) => (prev ? [...prev, newFolder] : [newFolder]))
                    setCreateFolderDialogOpen(false)
                    setCreateFolderName("")
                } else {
                    toast.error(status, { description: data.msg })
                }
            }
        })
    }

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
                    toast.success("Created Successfully", { description: data.msg })

                    const newFile: ContentInterface = {
                        name: createFilename,
                        type: "file",
                        size: new Blob([createContent]).size,
                        modifiedAt: new Date().toISOString(),
                    }
                    setContents((prev) => (prev ? [...prev, newFile] : [newFile]))
                    setCreateFileDialogOpen(false)
                    setCreateContent("")
                    setCreateFilename("")
                } else {
                    toast.error(status, { description: data.msg })
                }
            }
        })
    }

    useEffect(() => {
        setLoadingContents(true)

        const sendRequest = async () => {
            await sendAdminRequest({
                router,
                redirectToLogin: false,
                method: "POST",
                path: "content/cdn_files",
                body: JSON.stringify({
                    path: path,
                }),
                onResponse: (response, status, data) => {
                    if (status === ResponseStatus.FAILURE) {
                        toast.error(status, {description: data.msg})
                        return
                    }

                    setContents(data.contents)
                    setLoadingContents(false)
                    setLoading(false)
                }
            })
        }

        sendRequest()
    }, [path, reloadState]);

    const folderCount = filteredContents?.filter((item) => item.type === "directory").length ?? 0
    const fileCount = filteredContents?.filter((item) => item.type === "file").length ?? 0

    return (
        <DashboardLayout
            pageIcon={HardDriveIcon}
            title={"CDN File Manager"}
            description={"View / Edit CDN contents via SFTP (with Admin API)"}
            loadingState={loading}
            actionBarItems={[
                <div key={"searchInFolder"} className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search in folder..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>,
                <Button
                    key={"refreshList"}
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={() => {
                        setReloadState(prevState => !prevState)
                    }}
                >
                    <RefreshCcw className="size-4"/>
                </Button>,
                <DropdownMenu key="uploadContent" open={actionMenuOpen} onOpenChange={setActionMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button key="createNewArticle" className="gap-2">
                            <Grid2X2 className="size-4"/>
                            Actions
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onSelect={() => {
                                setActionMenuOpen(false)
                                setCreateFolderDialogOpen(true)
                            }}>
                            <Folder className="h-4 w-4 mr-2"/>
                            Create Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => {
                                setActionMenuOpen(false)
                                setCreateFileDialogOpen(true)
                            }}
                        >
                            <File className="h-4 w-4 mr-2"/>
                            Create File
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <FileUpIcon className="h-4 w-4 mr-2"/>
                            Upload File
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FolderUpIcon className="h-4 w-4 mr-2"/>
                            Upload Folder (.ZIP)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ]}
        >
            {!loading && (
                <div className="space-y-4">
                    <PathBreadcrumb path={path} onNavigate={handleOperations.onNavigate}/>

                    <div className="w-full space-y-4">
                        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 p-2">
                                        <TableHead className="font-semibold text-foreground">Name</TableHead>
                                        <TableHead className="font-semibold text-foreground w-[120px]">Type</TableHead>
                                        <TableHead className="font-semibold text-foreground w-[120px]">Size</TableHead>
                                        <TableHead className="font-semibold text-foreground w-[180px]">Modified
                                            At</TableHead>
                                        <TableHead
                                            className="font-semibold text-foreground w-[125px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingContents ? <TableRow>
                                        <TableCell colSpan={4}
                                                   className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Spinner className="h-10 w-10 text-muted-foreground/50"/>
                                                <span>Loading</span>
                                            </div>
                                        </TableCell>
                                    </TableRow> : <>
                                        {!filteredContents || filteredContents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4}
                                                           className="h-32 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Folder className="h-10 w-10 text-muted-foreground/50"/>
                                                        {searchQuery == "" ? <span>This folder is empty</span> :
                                                            <span>No any results found.</span>}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredContents.map((item, index) => {
                                                const fileInfo = getFileInformation(item.name, item.type == "directory")
                                                return ((
                                                    <TableRow key={`${item.name}-${index}`}
                                                              className="group hover:bg-muted/50 transition-colors">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3 m-1">
                                                                <FileIcon type={item.type}/>
                                                                <span
                                                                    className={cn(
                                                                        "font-medium", "cursor-pointer hover:text-primary hover:underline"
                                                                    )}
                                                                    onClick={() => {
                                                                        if (item.type === "directory") {
                                                                            handleOperations.onNavigate(path === "/" ? `/${item.name}` : `${path}/${item.name}`)
                                                                        }

                                                                        if (item.type == "file") {
                                                                            handleOperations.onOpen(path === "/" ? `/${item.name}` : `${path}/${item.name}`)
                                                                        }
                                                                    }}
                                                                >
                                                                <a>{fileInfo.name}</a><a className={"text-muted-foreground"}>
                                                                    {fileInfo.extension != "File" && fileInfo.extension != "Folder" && `.${fileInfo.extension.toLowerCase()}`}
                                                                </a>
                                                            </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {fileInfo.extension}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {item.type === "directory" ? "—" : formatFileSize(item.size)}
                                                        </TableCell>
                                                        <TableCell
                                                            className="text-muted-foreground">{formatDate(item.modifiedAt)}</TableCell>
                                                        <TableCell className="text-right">
                                                            {item.type == "file" && <Button variant="ghost" size="icon"
                                                                                            onClick={() => handleOperations.onShare(item)}>
                                                                <Share2 className="size-4"/>
                                                            </Button>}
                                                            <Button variant="ghost" size="icon"
                                                                    onClick={() => handleOperations.onRename(item)}>
                                                                <Pencil className="size-4"/>
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleOperations.onDelete(
                                                                    path === "/" ? `/${item.name}` : `${path}/${item.name}`,
                                                                    item.type == "directory",
                                                                    item.name
                                                                )}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="size-4"/>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            })
                                        )}
                                    </>}
                                </TableBody>
                            </Table>
                        </div>
                        {contents && contents.length > 0 && (
                            <div
                                className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                                <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5">
                                        <Folder className="h-4 w-4 text-amber-500"/>
                                            {folderCount} folder
                                        </span>
                                    <span className="flex items-center gap-1.5">
                                        <File className="h-4 w-4 text-blue-500"/>
                                        {fileCount} file
                                        </span>
                                </div>
                                <span>Total {contents.length} item</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
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
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateFolder} disabled={!createFolderName.trim()}>
                            Create Folder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={createFileDialogOpen} onOpenChange={setCreateFileDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Create New File</DialogTitle>
                        <DialogDescription>Create a new text file by entering the file name and content.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor={"filename"}>Name <a className={"text-muted-foreground"}>(with extension)</a></Label>
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
                        <Button variant="outline" onClick={() => setCreateFileDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateFile} disabled={!createFilename.trim()}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}

function PathBreadcrumb({path, onNavigate}: { path: string, onNavigate?: (path: string) => void }) {
    const parts = path.split("/").filter(Boolean)

    return (
        <div className="flex items-center gap-1 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => onNavigate?.("/")}
            >
                <Home className="h-4 w-4"/>
            </Button>

            {parts.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50"/>}

            {parts.map((part, index) => {
                const isLast = index === parts.length - 1
                const pathToHere = "/" + parts.slice(0, index + 1).join("/")

                return (
                    <div key={pathToHere} className="flex items-center gap-1">
                        {isLast ? (
                            <span
                                className="px-2 py-1 text-sm font-medium text-foreground bg-background rounded-xl border border-border/80 shadow-sm">
                                {part}
                            </span>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-background"
                                    onClick={() => onNavigate?.(pathToHere)}
                                >
                                    {part}
                                </Button>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/50"/>
                            </>
                        )}
                    </div>
                )
            })}

            {parts.length === 0 && <span className="px-2 py-1 text-sm font-medium text-foreground">Root</span>}
        </div>
    )
}

function getFileInformation(filename: string, isDirectory: boolean): { name: string, extension: string } {
    const lastDot = filename.lastIndexOf(".")

    return {
        name: lastDot === -1 ? filename : filename.substring(0, lastDot),
        extension: isDirectory ? "Folder" : lastDot === -1 ? "File" : filename.substring(lastDot + 1).toUpperCase()
    }
}


function FileIcon({type}: { type: "file" | "directory" }) {
    if (type === "directory") {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600">
                <Folder className="h-4 w-4 fill-current"/>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
            <File className="h-4 w-4"/>
        </div>
    )
}