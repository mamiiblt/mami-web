"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {HomeIcon} from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout
            pageIcon={HomeIcon}
            title={"Dashboard"}
            content={
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome to Admin Panel</p>
                </div>
            </div>
        } />
    )
}