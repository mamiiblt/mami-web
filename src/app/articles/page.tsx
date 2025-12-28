import {cookies} from "next/headers";
import {LANG_COOKIE_NAME} from "@/i18n/settings";
import getArticleList, {GetArticleListResponse} from "@/lib/articles/getArticleList";
import {ResponseStatus} from "@/lib/articles/consts";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {XIcon} from "lucide-react";
import ArticleListContent from "@/app/articles/ArticleListContent";
import {toStringParam} from "@/lib/utils";


export default async function ArticleListPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const cookieStore = await cookies()

    const payload = {
        page: Number(params.page ?? 1),
        topic: toStringParam(params.topic),
        search: toStringParam(params.search),
        locale: cookieStore.get(LANG_COOKIE_NAME)?.value ?? "en"
    }
    const postResponse: GetArticleListResponse = await getArticleList(payload)

    if (postResponse.status == ResponseStatus.FAILURE) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="shadow-lg">
                    <CardContent className="flex flex-col items-center mt-6">
                        <XIcon className="h-12 w-12"/>
                        <CardTitle className="text-center mt-2">An error occurred while fetching article list</CardTitle>
                        <p className="text-muted-foreground text-center mt-4 text-sm">{postResponse.desc ?? "No any error message"}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <ArticleListContent
            list={postResponse}
            page={payload.page}
            topic={payload.topic}
            search={payload.search}
        />
    )
}
