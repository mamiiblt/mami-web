"use client";

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Spinner} from "@/components/ui/spinner";
import {API_BASE, ArticleViewResponse} from "@/app/article/[locale]/[slug]/ArticlePostContent";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export const dynamic = "force-dynamic";

export interface ListResponse {
    status: string;
    nav: {
        current: number;
        total: number;
    },
    data: {
        id: string
        view_count: number
        read_time_min: number
        date: string
        banner_url: string
        title: string
        desc: string
    }[]
}

export default function ArticlesPage() {
    const { t, i18n } = useTranslation("articles_list");
    const searchParams = useSearchParams()
    const [list, setList] = useState<ListResponse | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true);

    const page = searchParams.get('page') ?? 1

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                const articleList = await fetch(
                    `${API_BASE}/get_articles/${page}?lang_code=${i18n.language}`
                );
                const articleListData: ListResponse = await articleList.json();
                if (isMounted) setList(articleListData)
            } catch (err) {
                console.error("Init error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        init();
        return () => {
            isMounted = false
        };
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-80 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">{t("loading")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Spinner className="h-12 w-12"/>
                    <p className="text-muted-foreground text-center text-sm">{t("pleaseWait")}</p>
                </CardContent>
            </Card>
        </div>
    }

    return (
        <>
            <pre>
                {JSON.stringify(list, null, 2)}
            </pre>
        </>
    );
}
