import {pgPool} from "@/lib/serverDatabase";
import {NextResponse} from "next/server";

export async function POST(req: Request) {

    const { comment_id, sid } = await req.json();

    const getCommentReq = await pgPool.query(`
        SELECT comment_id, writer_sid
        FROM article_comments
        WHERE comment_id = $1
    `, [comment_id as string])

    if (getCommentReq.rows.length == 0) {
        return NextResponse.json({
            code: "COMMENT_NOT_FOUND"
        } as CommentDeleteResponse)
    }

    const commentData = getCommentReq.rows[0]
    if (commentData.writer_sid != sid) {
        return NextResponse.json({
            code: "SID_DOES_NOT_MATCH"
        } as CommentDeleteResponse)
    }

    await pgPool.query(`
        DELETE FROM article_comments 
        WHERE comment_id = $1 AND writer_sid = $2
    `, [comment_id, sid])

    return NextResponse.json({
        code: "DELETE_SUCCESS"
    } as CommentDeleteResponse)
}

export interface CommentDeleteResponse {
    code: "COMMENT_NOT_FOUND" | "SID_DOES_NOT_MATCH" | "DELETE_SUCCESS"
}