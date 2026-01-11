import {ResponseStatus, supportedArticleLocales} from "@/lib/articles/consts";
import {createLogger, LogLevel} from "@/lib/serverLogger";
import {pgPool} from "@/lib/serverDatabase";
import {checkSessionIdUsedBefore, getArticleLikeStatus} from "@/lib/articles/utils";
import {randomUUID} from "node:crypto";

interface GetArticleParams {
    article_id: string
    session_id: string
    locale: string
}

const logger = createLogger("ARTICLES", "getArticle")

export default async function getArticle(
    { article_id, session_id, locale }: GetArticleParams
): globalThis.Promise<GetArticleResponse> {
    if (!supportedArticleLocales.includes(locale)) {
        return {
            status: ResponseStatus.FAILURE,
            desc: "locale should be en or tr"
        }
    }

    const articleDatas = await pgPool.query(`
        SELECT like_count::integer AS lc, view_count::integer AS vc, date AS dt, topic AS tp, id_a::integer AS id_a,
            title_${locale} AS tt,
            desc_${locale} AS dc,
            cont_${locale} AS cn,
            banner_fn
        FROM mami_articles
        WHERE id = $1
    `, [article_id])

    if (articleDatas.rows.length == 0) {
        return {
            status: ResponseStatus.NOT_FOUND
        }
    }

    const articleData = articleDatas.rows[0]

    await pgPool.query(`
        UPDATE mami_articles
        SET view_count = view_count + 1
        WHERE id_a = $1
    `, [articleData.id_a])

    var isPostLiked = false;
    var isSessionCreatedNow = false;
    var uSessID = null;

    const sessionIdUsedBefore = await checkSessionIdUsedBefore(session_id)
    if (sessionIdUsedBefore) {
        uSessID = session_id as string;
        isSessionCreatedNow = false;
        isPostLiked = await getArticleLikeStatus(uSessID, articleData.id_a)
    } else {
        uSessID = randomUUID();
        isSessionCreatedNow = true;
        isPostLiked = false;

        await pgPool.query(`
            INSERT INTO mami_article_like_sessions (session_id)
            VALUES ($1)
        `, [uSessID])
        logger.log(LogLevel.INFO, `Session isn't created before, now created with ID ${uSessID}`)
    }

    return {
        status: ResponseStatus.SUCCESS,
        data: {
            gen: {
                id: article_id,
                sid: uSessID,
                ipl: isPostLiked,
                iscn: isSessionCreatedNow
            },
            articleData
        }
    }
}

export interface GetArticleResponse {
    status: ResponseStatus.SUCCESS | ResponseStatus.FAILURE | ResponseStatus.NOT_FOUND
    desc?: string
    data?: {
        gen: {
            id: string
            sid: string
            ipl: boolean
            iscn: boolean
        },
        articleData: {
            lc: number
            vc: number
            dt: string
            tp: string
            id_a: number
            tt: string
            dc: string
            cn: string
            banner_fn: string
        }
    }
}