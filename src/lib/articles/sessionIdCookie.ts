import {cookies} from "next/headers";

export const SESSION_ID_COOKIE = "ARAPI_SESSION_ID"

export async function getSessionId(): Promise<string> {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_ID_COOKIE)?.value ?? "undefined";
}