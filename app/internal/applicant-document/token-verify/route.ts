import { API_BASE_URL } from "@/lib/api-config";
import { NextResponse } from "next/server";

const BASE_URL = API_BASE_URL

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    const res = await fetch(
        `${BASE_URL}/api/method/resume.api.api.verify_document_token?token=${token}`
    );

    const data = await res.json();

    return NextResponse.json(data.message);
}
