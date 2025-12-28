import {pgPool} from "@/lib/serverDatabase";

export async function checkSessionIdUsedBefore(sessionId: string): Promise<boolean> {
    if (sessionId == undefined) return false

    const result = await pgPool.query<{ exists: boolean }>(`
        SELECT EXISTS (
            SELECT 1 FROM mami_article_like_sessions 
            WHERE session_id = $1) 
        AS exists
    `, [sessionId]);

    const exists = result.rows[0]?.exists ?? false;
    return exists;
}

export async function getArticleLikeStatus(sessionId: string, article_db_id: number): Promise<boolean> {
    const result = await pgPool.query<{ liked: boolean }>(`
        SELECT EXISTS (
            SELECT 1
            FROM mami_article_like_sessions
            WHERE session_id = $1
            AND $2 = ANY(liked_posts)
            ) AS liked
    `, [sessionId, article_db_id]);

    const liked = result.rows[0]?.liked ?? false;
    return liked
}