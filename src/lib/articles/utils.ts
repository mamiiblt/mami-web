/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

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