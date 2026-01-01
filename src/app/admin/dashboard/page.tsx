"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {HomeIcon} from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout pageIcon={HomeIcon} title={"Home"} description={"Welcome to Admin Panel"}>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">bö</h1>
                </div>
            </div>
        </DashboardLayout>
    )
}