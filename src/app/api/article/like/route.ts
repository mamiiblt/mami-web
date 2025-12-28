import { NextResponse } from "next/server";
import {createLogger, LogLevel} from "@/lib/serverLogger";
import {articleModuleName} from "@/lib/articles/consts";
import {checkSessionIdUsedBefore, getArticleLikeStatus} from "@/lib/articles/utils";
import {pgPool} from "@/lib/serverDatabase";

const logger = createLogger(articleModuleName, "likeArticle")
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
    if (userAlreadyLikedIt) {
        logger.log(LogLevel.WARN, `Session with ID ${sid} already liked the post with ID ${id_a}.`)
        return NextResponse.json({
            status: "USER_ALREADY_LIKED"
        });
    }

    await pgPool.query(
        `
            INSERT INTO mami_article_like_sessions (session_id, liked_posts)
            VALUES ($1, ARRAY[$2]::INT4[])
                ON CONFLICT (session_id)
                DO UPDATE
                    SET liked_posts = array_append(
                        mami_article_like_sessions.liked_posts,
                        $2
                    );
        `,
        [sid, id_a]
    );

    await pgPool.query(`
        UPDATE mami_articles
        SET like_count = like_count + 1
        WHERE id_a = $1;
    `, [id_a])


    logger.log(LogLevel.INFO, `Session with ID ${sid} liked post with ID ${id_a}`)
    return NextResponse.json({
        status: "POST_LIKE_SUCCESS"
    });
}
