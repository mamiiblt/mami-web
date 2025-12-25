// app/api/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_ID_COOKIE = "ARAPI_SESSION_ID"

export async function GET() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value ?? "undefined";
    if (sessionId == "undefined") {
        cookieStore.set(SESSION_ID_COOKIE, "undefined", {
            path: "/",
            sameSite: "lax",
        });
    }

    return NextResponse.json({
        sessionIdValue: sessionId
    });
}
