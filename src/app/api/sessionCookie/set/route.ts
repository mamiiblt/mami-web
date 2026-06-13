/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {SESSION_ID_COOKIE} from "@/app/api/sessionCookie/get/route";

export async function POST(req: Request) {
    const { value } = await req.json();

    const cookieStore = await cookies()
    cookieStore.set(SESSION_ID_COOKIE, value, {
        path: "/",
        sameSite: "lax",
        maxAge: (30 * 24 * 60 * 60) * 6
    });

    return NextResponse.json({ STATUS: true });
}
