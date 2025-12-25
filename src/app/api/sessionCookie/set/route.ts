import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {SESSION_ID_COOKIE} from "@/app/api/sessionCookie/get/route";

export async function POST(req: Request) {
    const { value } = await req.json();

    const cookieStore = await cookies()
    cookieStore.set(SESSION_ID_COOKIE, value, {
        path: "/",
        sameSite: "lax",
    });

    return NextResponse.json({ STATUS: true });
}
