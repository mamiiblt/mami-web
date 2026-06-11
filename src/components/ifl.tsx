import {Spinner} from "@/components/ui/spinner";
import React from "react";

export function LoadingBar() {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-14 w-14"/>
    </div>
}
