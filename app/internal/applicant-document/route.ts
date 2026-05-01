import { NextResponse } from 'next/server';

const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json'
});

const BASE_URL = 'https://ats.vaaman.in'; 

// GET: Fetch existing document
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const applicantName = searchParams.get('applicant_name');

    if (!applicantName) return NextResponse.json({ error: 'Missing applicant_name' }, { status: 400 });

    try {
        const url = `${BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${applicantName}"]]&fields=["*"]&limit_page_length=0`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}

// POST: Create a new document
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await fetch(`${BASE_URL}/api/resource/Applicant Document`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}

// PUT: Update an existing document
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

        const res = await fetch(`${BASE_URL}/api/resource/Applicant Document/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}