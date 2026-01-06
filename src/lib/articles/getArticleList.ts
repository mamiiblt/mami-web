import {pgPool} from "@/lib/serverDatabase";
import {ResponseStatus, supportedArticleLocales} from "@/lib/articles/consts";

interface GetArticleListParams {
    page: number
    topic: string
    search: string
    locale: string
}

const conValues = {
    topic: "CL-TP",
    title: "CL-TT"
}

const SIZE_PER_PAGE = 9

export default async function getArticleList(
    { page, topic, search, locale }: GetArticleListParams
): globalThis.Promise<GetArticleListResponse> {
    if (!supportedArticleLocales.includes(locale)) {
        return {
            status: ResponseStatus.FAILURE,
            desc: "locale should be en or tr"
        }
    }

    if (page < 1) {
        return {
            status: ResponseStatus.FAILURE,
            desc: "Page number cannot be equal to 0 or smaller than 0"
        }
    }

    const topicCondition = topic != null ? `CL-TP = '${topic}'` : ""
    const searchCondition = search != null ? `CL-TT ILIKE '%${search}%'` : ""
    const conditions = [topicCondition, searchCondition].filter(Boolean).join(' AND ');
    const conditionTerm = conditions.trim().length == 0 ? null : conditions.trim()

    const totalSizeReq = await pgPool.query(`
        SELECT COUNT (*) AS total FROM mami_articles 
            ${conditionTerm ? `WHERE ${
        conditionTerm
            .replace(conValues.topic, "topic")
            .replace(conValues.title, `title_${locale}`)
    }` : ""}
    `)
    const totalCount = totalSizeReq.rows[0].total
    const totalPageSize = Math.ceil(totalCount == 0 ? 1 : totalCount / SIZE_PER_PAGE);

    if (page > totalPageSize) {
        return {
            status: ResponseStatus.FAILURE,
            desc: "Page number cannot be bigger than totalPageSize"
        }
    }

    const offset = (page - 1) * SIZE_PER_PAGE

    const articlesResponse = await pgPool.query(`
        SELECT id,
               rtm             AS rt,
               date            AS dt,
               topic           AS tp,
               id_a::integer   AS id_a,
               title_${locale} AS tt,
               desc_${locale}  AS dc
        FROM mami_articles ${conditionTerm ? `WHERE ${
                conditionTerm
                        .replace(conValues.topic, "topic")
                        .replace(conValues.title, `title_${locale}`)
        }` : ""}
        ORDER BY dt
            DESC
        LIMIT $1 OFFSET $2
    `, [SIZE_PER_PAGE, offset]);

    const topicsResponse = await pgPool.query(`SELECT DISTINCT topic FROM mami_articles`)
    const topicsArray = topicsResponse.rows.map(row => row.topic).sort();

    return {
        status: ResponseStatus.SUCCESS,
        data: {
            totalPageSize,
            totalCount,
            topics: topicsArray,
            articles: articlesResponse.rows
        }
    }
}

export interface GetArticleListResponse {
    status: ResponseStatus.SUCCESS | ResponseStatus.FAILURE
    desc?: string
    data?: {
        totalPageSize: number
        totalCount: number
        topics: string[]
        articles: {
            id: string
            rt: number
            dt: string
            tp: string
            id_a: number
            tt: string
            dc: string
        }[]
    }
}
