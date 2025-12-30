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
