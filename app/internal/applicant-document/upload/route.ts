import { NextResponse } from 'next/server';
const BASE_URL = 'https://ats.vaaman.in';
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const res = await fetch(`${BASE_URL}/api/method/upload_file`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`
            },
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

