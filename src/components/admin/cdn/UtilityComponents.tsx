
import React from "react";
import {Folder, File, Home, ChevronLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export function FileIcon({type}: { type: "file" | "directory" }) {
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

export function PathBreadcrumb({path, onNavigate}: { path: string, onNavigate?: (path: string) => void }) {
    const parts = path.split("/").filter(Boolean)
    const backPath = `/${parts[parts.length - 2]}` == "/undefined" ? "/" : `/${parts[parts.length - 2]}`

    return (
        <div className="flex h-12 items-center gap-1 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">

            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                disabled={parts.length == 0}
                onClick={() => onNavigate?.(backPath)}
            >
                <ChevronLeft className="h-4 w-4"/>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => onNavigate?.("/")}
            >
                <Home className="h-4 w-4"/>
            </Button>

            {parts.length > 0 && <a className={"text-muted-foreground/50"}>/</a>}

            {parts.map((part, index) => {
                const isLast = index === parts.length - 1
                const pathToHere = "/" + parts.slice(0, index + 1).join("/")

                return (
                    <div key={pathToHere} className="flex items-center gap-1">
                        {isLast ? (
                            <span
                                className="px-2 py-1 text-sm font-medium text-foreground bg-background rounded-lg border border-border/80 hover:bg-muted/30 shadow-sm">
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
                                <a className={"text-muted-foreground/50"}>/</a>
                            </>
                        )}
                    </div>
                )
            })}

            {parts.length === 0 && <span className="px-2 py-1 text-sm font-medium text-foreground">Root Directory</span>}
        </div>
    )
}
