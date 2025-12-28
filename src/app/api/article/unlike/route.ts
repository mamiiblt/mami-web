import { NextResponse } from "next/server";
import {createLogger, LogLevel} from "@/lib/serverLogger";
import {articleModuleName} from "@/lib/articles/consts";
import {checkSessionIdUsedBefore, getArticleLikeStatus} from "@/lib/articles/utils";
import {pgPool} from "@/lib/serverDatabase";

const logger = createLogger(articleModuleName, "unlikeArticle")
export async function POST(req: Request) {

    const { id_a, sid } = await req.json();

    const sessionIdUsedBefore = await checkSessionIdUsedBefore(sid)

    if (!sessionIdUsedBefore) {
        logger.log(LogLevel.WARN, `Session ID is invalid, ${sid}`)
        return NextResponse.json({
            status: "SESSION_ID_INVALID"
        });
    }

    const userAlreadyLikedIt = await getArticleLikeStatus(sid, id_a)
    if (!userAlreadyLikedIt) {
        logger.log(LogLevel.WARN, `Session with ID ${sid} isn't liked the post with ID ${id_a}`)
        return NextResponse.json({
            status: "USER_NOT_LIKED_POST"
        });
    }

    await pgPool.query(`
        UPDATE mami_article_like_sessions
        SET liked_posts = array_remove(liked_posts, $1::INT4)
        WHERE session_id = $2;
    `, [id_a, sid])

    await pgPool.query(`
        UPDATE mami_articles
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id_a = $1
    `, [id_a,])


    logger.log(LogLevel.INFO, `Session with ID ${sid} un-liked post with ID ${id_a}.`)
    return NextResponse.json({
        status: "POST_UNLIKE_SUCCESS"
    });
}
