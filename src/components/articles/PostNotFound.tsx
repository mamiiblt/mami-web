/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

"use client";

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {XIcon} from "lucide-react";
import {useTranslation} from "react-i18next";

export default function PostNotFound() {
    const { t } = useTranslation("articles")

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center mt-6">
                    <XIcon className="h-12 w-12"/>
                    <CardTitle className="text-center mt-2">{t("notFound")}</CardTitle>
                    <p className="text-muted-foreground text-center mt-4 text-sm">{t("notFoundDesc")}</p>
                </CardContent>
            </Card>
        </div>
    )
}