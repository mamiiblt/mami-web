/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import {Spinner} from "@/components/ui/spinner";
import React from "react";

export function LoadingBar() {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-14 w-14"/>
    </div>
}
