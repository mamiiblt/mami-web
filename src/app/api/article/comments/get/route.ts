/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import { NextResponse } from "next/server";
import getComments, {GetCommentResponse} from "@/lib/articles/getComments";

export async function POST(req: Request) {

    const { id_a, sid, page } = await req.json();
    const response: GetCommentResponse = await getComments({
        id_a,
        sid,
        page
    })
    return NextResponse.json(response);
}
