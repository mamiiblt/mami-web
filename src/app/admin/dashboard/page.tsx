/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

"use client";

import {DashboardLayout} from "@/components/admin/DashboardLayout";
import {HomeIcon} from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout
            pageIcon={HomeIcon}
            title={"Home"}
            description={"Welcome to Admin Panel"}
            loadingState={false}
        >
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">bö</h1>
                </div>
            </div>
        </DashboardLayout>
    )
}