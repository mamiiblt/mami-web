"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {
    ChevronRight, CircleCheck,
    File,
    FilePenLine,
    FileUp,
    FileUpIcon,
    Folder,
    Grid2X2,
    HardDriveIcon,
    Home,
    RefreshCcw,
    RouteIcon,
    Search,
    Trash2,
    Upload,
    X
} from "lucide-react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {ResponseStatus, sendAdminRequest} from "@/lib/adminUtils";
import {toast} from "sonner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {cn, formatDateWithTime, formatFileSize} from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import CDN_CreateFileDialog from "@/components/admin/cdn/CDN_CreateFileDialog";
import CDN_CreateFolderDialog from "@/components/admin/cdn/CDN_CreateFolderDialog";
import CDN_MoveItemDialog from "@/components/admin/cdn/CDN_MoveItemDialog";
import CDN_EditItemDialog, {loadCdnFileContent} from "@/components/admin/cdn/CDN_EditItemDialog";
import CDN_UploadFilesDialog from "@/components/admin/cdn/CDN_UploadFilesDialog";
import {FileIcon, PathBreadcrumb} from "@/components/admin/cdn/UtilityComponents";

export interface ContentInterface {
    name: string;
    type: "file" | "directory";
    size?: any;
    modifiedAt: any;
}

export default function DashboardPage() {
    const router = useRouter()
    const [path, setPath] = useState("/");
    const [contents, setContents] = useState<ContentInterface[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [loadingContents, setLoadingContents] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [reloadState, setReloadState] = useState(false);
    const [actionMenuOpen, setActionMenuOpen] = useState(false)

    const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false)
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [editFileDialogOpen, setEditFileDialogOpen] = useState(false)

    const [moveDialogOpen, setMoveDialogOpen] = useState(false)
    const [moveDialogOldPath, setMoveDialogOldPath] = useState("")
    const [moveDialogNewPath, setMoveDialogNewPath] = useState("")

    const [editFilePath, setEditFilePath] = useState("")
    const [editFileContent, setEditFileContent] = useState("")

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

    const handleOperations = {
        onNavigate: (path: string) => {
            setPath(path)
            setSearchQuery("")
        },
        onOpen: (path: string) => window.open(`https://cdn.mamii.dev${path}`, "_blank", "noopener,noreferrer"),
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
                        toast.success("Deleted", {description: data.msg})
                    } else {
                        toast.error(status, {description: data.msg})
                    }

                    setContents(contents.filter(item => item.name !== itemName))
                }
            })
        },
        onMoveItem: (item: ContentInterface) => {
            setMoveDialogOpen(true)
            const itemPath = path === "/" ? `/${item.name}` : `${path}/${item.name}`
            setMoveDialogOldPath(itemPath)
            setMoveDialogNewPath(itemPath)
        }
    }

    const filteredContents = useMemo(() => {
        if (!contents) return []

        const query = searchQuery.toLowerCase()

        return contents.filter(content =>
            content.name.toLowerCase().includes(query)
        ).sort((a, b) => {
            if (a.type === "directory" && b.type !== "directory") return -1
            if (a.type !== "directory" && b.type === "directory") return 1
            return 0
        })
    }, [contents, searchQuery])

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
                        <DropdownMenuItem
                            onSelect={() => {
                                setActionMenuOpen(false)
                                setUploadDialogOpen(true)
                            }}>
                            <FileUpIcon className="h-4 w-4 mr-2"/>
                            Upload File(s)
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
                                            className="font-semibold text-foreground w-[170px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingContents ? <TableRow>
                                        <TableCell colSpan={5}
                                                   className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Spinner className="h-10 w-10 text-muted-foreground/50"/>
                                                <span>Loading</span>
                                            </div>
                                        </TableCell>
                                    </TableRow> : <>
                                        {!filteredContents || filteredContents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5}
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
                                                const fileExtension = getFileExtInfo(item.name, item.type == "directory")
                                                const fileNameParts = splitFileNameByDot(item.name)
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
                                                                <a>{fileNameParts.before}</a>{fileNameParts.after && <a className={"text-muted-foreground"}>.{fileNameParts.after}</a>}
                                                            </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {fileExtension}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {item.type === "directory" ? "—" : formatFileSize(item.size)}
                                                        </TableCell>
                                                        <TableCell
                                                            className="text-muted-foreground">{formatDateWithTime(item.modifiedAt, "en-US")}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" onClick={() => handleOperations.onMoveItem(item)}>
                                                                <RouteIcon className="size-4"/>
                                                            </Button>

                                                            {item.type == "file" &&
                                                                <Button variant="ghost" size="icon" onClick={async () => {
                                                                    const filePath = path === "/" ? `/${item.name}` : `${path}/${item.name}`
                                                                    setEditFilePath(filePath)
                                                                    const textData = await loadCdnFileContent(`https://cdn.mamii.dev${filePath}`)
                                                                    if (textData != null) {
                                                                        setEditFileContent(textData)
                                                                        setEditFileDialogOpen(true)
                                                                    } else {
                                                                        toast.error("File is not in TEXT BINARY format.")
                                                                    }
                                                                }}>
                                                                    <FilePenLine className="size-4"/>
                                                                </Button>}

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

            <CDN_UploadFilesDialog router={router} isDialogOpen={uploadDialogOpen} setIsDialogOpen={setUploadDialogOpen} path={path} setReloadState={setReloadState} />
            <CDN_MoveItemDialog router={router} isDialogOpen={moveDialogOpen} setIsDialogOpen={setMoveDialogOpen} setReloadState={setReloadState} moveDialogOldPath={moveDialogOldPath} moveDialogNewPath={moveDialogNewPath} setMoveDialogNewPath={setMoveDialogNewPath} setMoveDialogOldPath={setMoveDialogOldPath} />
            <CDN_EditItemDialog router={router} isDialogOpen={editFileDialogOpen} setIsDialogOpen={setEditFileDialogOpen} editFilePath={editFilePath} setEditFilePath={setEditFilePath} editFileContent={editFileContent} setEditFileContent={setEditFileContent} />
            <CDN_CreateFolderDialog router={router} isDialogOpen={createFolderDialogOpen} setIsDialogOpen={setCreateFolderDialogOpen} path={path} setContents={setContents} />
            <CDN_CreateFileDialog router={router} isDialogOpen={createFileDialogOpen} setIsDialogOpen={setCreateFileDialogOpen} path={path} setContents={setContents} />
        </DashboardLayout>
    )
}

function getFileExtInfo(filename: string, isDirectory: boolean): string {
    const lastDot = filename.lastIndexOf(".")
    return isDirectory ? "Folder" : lastDot === -1 ? "File" : filename.substring(lastDot + 1).toUpperCase()
}

function splitFileNameByDot(text) {
    const index = text.lastIndexOf(".");

    if (index === -1) {
        return {
            before: text,
            after: null
        };
    }

    return {
        before: text.slice(0, index),
        after: text.slice(index + 1)
    };
}