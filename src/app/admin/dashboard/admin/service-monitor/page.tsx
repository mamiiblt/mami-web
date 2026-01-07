"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {MonitorIcon} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";

export default function DashboardPage() {
    const router = useRouter()

    return (
        <DashboardLayout
            pageIcon={MonitorIcon}
            title={"Service Monitor"}
            description={"View technical & operational status of mamii's apps"}
            loadingState={false}
        >
            {
                <div>selam</div>
            }
        </DashboardLayout>
    )
}