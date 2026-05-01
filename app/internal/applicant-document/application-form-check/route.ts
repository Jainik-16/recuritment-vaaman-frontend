import { NextResponse } from 'next/server';
const BASE_URL = 'https://ats.vaaman.in';
const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json',
});
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const applicantName = searchParams.get('applicant_name');
    if (!applicantName) return NextResponse.json({ submitted: false }, { status: 400 });
    try {
        const res = await fetch(
            `${BASE_URL}/api/resource/Application Form?filters=[["applicant_email","=","${applicantName}"]]&fields=["name"]`,
            { headers: getAuthHeaders() }
        );
        const data = await res.json();
        return NextResponse.json({ submitted: data?.data?.length > 0 }, { status: 200 });
    } catch {
        return NextResponse.json({ submitted: false }, { status: 500 });
    }
}