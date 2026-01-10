import {NextResponse} from "next/server";
import {pgPool} from "@/lib/serverDatabase";
import {randomUUID} from "node:crypto";
import { Filter } from 'bad-words'

export const MAX_CONTENT_LENGTH = 500
export const MAX_NAME_LENGTH = 35
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
const filter = new Filter()

export async function POST(req: Request) {

    const { id_a, sid, content, author_name, locale } = await req.json();

    const secureLocale = locale == "tr" ? "tr" : "en"

    if (!content.trim() || !author_name.trim()) return createResponse("CONTENT_OR_NAME_CANNOT_BE_EMPTY", secureLocale)

    const isArticleAvailable = await pgPool.query(`
        SELECT id
        FROM mami_articles
        WHERE id_a = $1
    `, [id_a])

    console.log(isArticleAvailable.rows)

    if (isArticleAvailable.rows.length == 0) return createResponse("ARTICLE_NOT_EXISTS", secureLocale)

    const isSessionAvailable = await pgPool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM mami_article_like_sessions
            WHERE session_id = $1
        )
    `, [sid])

    if (!isSessionAvailable.rows[0].exists) return createResponse("SESSION_NOT_EXISTS", secureLocale)

    const countRes = await pgPool.query(
        `
            SELECT COUNT(*)::int AS count
            FROM article_comments
            WHERE article_id_a = $1
            AND writer_sid = $2
    `,
        [id_a, sid]
    );


    if (countRes.rows[0].count >= 2) return createResponse("MAX_2_COMMENT", secureLocale)
    if (URL_REGEX.test(content)) return createResponse("COMMENT_CONTAINS_URL", secureLocale)
    if (content.length > MAX_CONTENT_LENGTH) return createResponse("CONTENT_TOO_LONG", secureLocale)
    if (author_name.length > MAX_NAME_LENGTH) return createResponse("AUTHOR_NAME_TOO_LONG", secureLocale)
    if (filter.isProfane(content) || filter.isProfane(author_name)) return createResponse("CONTAINS_BAD_WORDS", secureLocale)
    if (/(.)\1{5,}/.test(content)) return createResponse("REPEATED_CHAR_SPAM", secureLocale)

    await pgPool.query(`
        INSERT INTO article_comments (
            comment_id, article_id_a, writer_sid, comment, author_name
        )
        VALUES ($1, $2, $3, $4, $5)
    `, [randomUUID(), id_a, sid, content.replace("\n", ""), author_name])

    return createResponse("SHARE_SUCCESS", secureLocale)
}

export interface NewCommentResponse {
    code: "CONTENT_OR_NAME_CANNOT_BE_EMPTY" | "ARTICLE_NOT_EXISTS"
        | "SESSION_NOT_EXISTS" | "COMMENT_CONTAINS_URL" | "SHARE_SUCCESS" |
        "CONTENT_TOO_LONG" | "AUTHOR_NAME_TOO_LONG" | "CONTAINS_BAD_WORDS" | "REPEATED_CHAR_SPAM"
}

const statusEnglish = {
    CONTENT_OR_NAME_CANNOT_BE_EMPTY: "Message content or author name cannot be empty.",
    ARTICLE_NOT_EXISTS: "Article doesn't exists, so you cannot comment.",
    SESSION_NOT_EXISTS: "Session doesn't exists, please allow cookies.",
    COMMENT_CONTAINS_URL: "Your comment contains link, please remote it.",
    SHARE_SUCCESS: "Comment shared successfully, thanks!",
    CONTENT_TOO_LONG: `Your comment is too long, max ${MAX_CONTENT_LENGTH} character is allowed.`,
    AUTHOR_NAME_TOO_LONG: `Your name is too long, max ${MAX_NAME_LENGTH} character is`,
    CONTAINS_BAD_WORDS: "Your comment contains bad words, please remove it..",
    REPEATED_CHAR_SPAM: "Please don't spam anything...",
    MAX_2_COMMENT: "You can send max 2 comment for a post."
}

const statusTurkish = {
    CONTENT_OR_NAME_CANNOT_BE_EMPTY: "Mesaj veya kullanıcı adı boş olamaz.",
    ARTICLE_NOT_EXISTS: "Makale bulunamadı, dolayısıyla yorum yapamazsın.",
    SESSION_NOT_EXISTS: "Oturum mevcut görünmüyor, çerezlere izin ver...",
    COMMENT_CONTAINS_URL: "Yorumun link içeriyor, sil kardeşim.",
    SHARE_SUCCESS: "Yorumun başarıyla paylaşıldı, teşekkürler!",
    CONTENT_TOO_LONG: `Yorumun çok uzun! Maksimum ${MAX_CONTENT_LENGTH} karaktere izin veriyoruz...`,
    AUTHOR_NAME_TOO_LONG: `İsmin çok uzun! Maksimum ${MAX_CONTENT_LENGTH} karaktere izin veriyoruz...`,
    CONTAINS_BAD_WORDS: "Yorumun kötü kelimeler içeriyor, lütfen onları kaldır...",
    REPEATED_CHAR_SPAM: "Bir şeyler spamlama...",
    MAX_2_COMMENT: "Bir yazı için maksimum 2 yorum paylaşabilirsiniz."
}

function createResponse(code: string, locale: "tr" | "en"): NextResponse<NewCommentResponse> {
    const resources = locale == "tr" ? statusTurkish : statusEnglish
    return NextResponse.json({
        code: code,
        message: resources[code]
    } as NewCommentResponse)
}
