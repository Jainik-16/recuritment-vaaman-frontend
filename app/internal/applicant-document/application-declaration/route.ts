import { NextResponse } from 'next/server';

const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json'
});

const BASE_URL = 'https://ats.vaaman.in';

// POST: Create new Application Declaration
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Exact field names: name1, date, place, signature (Small Text)
        const payload = {
            custom_applicant_email: body.custom_applicant_email || null,
            name1: body.name1 || null,
            date: body.date || null,
            place: body.place || null,
            signature: body.signature || null,  // base64 PNG string stored in Small Text
        };

        const res = await fetch(`${BASE_URL}/api/resource/Application Declaration`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Declaration POST error:', error);
        return NextResponse.json({ error: 'Failed to create declaration' }, { status: 500 });
    }
}

// PUT: Update existing Declaration
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

        const res = await fetch(`${BASE_URL}/api/resource/Application Declaration/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Declaration PUT error:', error);
        return NextResponse.json({ error: 'Failed to update declaration' }, { status: 500 });
    }
}


