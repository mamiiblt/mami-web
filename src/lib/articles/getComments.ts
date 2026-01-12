import {ResponseStatus} from "@/lib/articles/consts";
import {createLogger} from "@/lib/serverLogger";
import {pgPool} from "@/lib/serverDatabase";

interface GetCommentParams {
    id_a: number
    sid: string
    page: number
}

const COMMENT_PER_PAGE = 7

export default async function getComments(
    { id_a, sid, page }: GetCommentParams
): globalThis.Promise<GetCommentResponse> {

    const totalSizeReq = await pgPool.query(`
        SELECT COUNT(*) AS total FROM article_comments
    `)
    const totalCommentCount = Number(totalSizeReq.rows[0].total)
    const totalPageSize = Math.ceil(totalCommentCount == 0 ? 1 : totalCommentCount / COMMENT_PER_PAGE);

    if (page > totalPageSize) {
        return {
            status: ResponseStatus.FAILURE,
            desc: "Page number cannot be bigger than totalPageSize"
        }
    }

    const offset = (page - 1) * COMMENT_PER_PAGE

    const commentResponse = await pgPool.query(`
        SELECT
            comment_id,
            article_id_a,
            author_name,
            comment,
            publish_time,
            (writer_sid = $1) AS is_owner
        FROM article_comments
        WHERE article_id_a = $2
        ORDER BY publish_time DESC
        LIMIT $3 OFFSET $4
    `, [sid, id_a, COMMENT_PER_PAGE, offset])

    return {
        status: ResponseStatus.SUCCESS,
        data: {
            info: {
                commentCount: totalCommentCount,
                totalPageSize: totalPageSize,
                currentPage: page
            },
            comments: commentResponse.rows
        }
    } as GetCommentResponse
}

export interface GetCommentResponse {
    status: ResponseStatus.SUCCESS | ResponseStatus.FAILURE
    desc?: string
    data?: {
        info: {
            commentCount: number
            totalPageSize: number
            currentPage: number
        },
        comments: CommentData[]
    }
}

export interface CommentData {
    comment_id: string
    article_id_a: number
    author_name: string
    comment: string
    publish_time: string
    is_owner: boolean
}