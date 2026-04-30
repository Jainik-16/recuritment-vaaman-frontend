const BASE_URL = 'https://ats.octavision.in';
const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json'
});

// Inside your route file (e.g., app/internal/applicant-document/verify/route.ts)
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const applicantName = searchParams.get('applicant_name');

    if (!applicantName) return NextResponse.json({ error: 'Missing applicant_name' }, { status: 400 });

    try {
        // Query the 'Applicant' Doctype directly to see if they exist
        const url = `${BASE_URL}/api/resource/Job Applicant?filters=[["name","=","${applicantName}"]]&fields=["name"]`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();

        // If data.data has length > 0, the applicant is valid
        const exists = data.data && data.data.length > 0;
        return NextResponse.json({ exists }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ exists: false }, { status: 500 });
    }
}