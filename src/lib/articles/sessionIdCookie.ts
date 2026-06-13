/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import {cookies} from "next/headers";

export const SESSION_ID_COOKIE = "ARAPI_SESSION_ID"

export async function getSessionId(): Promise<string> {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_ID_COOKIE)?.value ?? "undefined";
}