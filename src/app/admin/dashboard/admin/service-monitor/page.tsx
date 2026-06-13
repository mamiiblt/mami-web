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
import {MonitorIcon} from "lucide-react";
import React from "react";

export default function DashboardPage() {
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