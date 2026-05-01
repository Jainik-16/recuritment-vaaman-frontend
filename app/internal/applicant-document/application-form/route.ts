
import { NextResponse } from 'next/server';

const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json',
});

const BASE_URL = 'https://ats.vaaman.in';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const payload = {
            date: body.date || null,
            applicant_email: body.applicant_email || null,
            post_applied_for: body.post_applied_for || null,
            job_location: body.job_location || null,
            vacancy_known_from: body.vacancy_known_from || null,
            contact_number: body.contact_number || null,
            passport_size_photo: body.passport_size_photo || null,
            name1: body.name1 || null,
            father_name: body.father_name || null,
            occupation: body.occupation || null,
            local_address: body.local_address || null,
            permanent_address: body.permanent_address || null,
            alternate_contact_number: body.alternate_contact_number || null,
            email_id: body.email_id || null,
            birth_date: body.birth_date || null,
            place_of_domicile: body.place_of_domicile || null,
            marital_status_are_you_married: body.marital_status_are_you_married || null,
            wife__husband_name: body.wife__husband_name || null,
            his__her_place_of_work: body.his__her_place_of_work || null,
            children_if_any_name_1: body.children_if_any_name_1 || null,
            child_1_age: body.child_1_age || null,
            children_if_any_name_2: body.children_if_any_name_2 || null,
            child_2_age: body.child_2_age || null,
            health_details: body.health_details || null,
            hobbies: body.hobbies || null,
            epfo_membership: body.epfo_membership || 'YES',
            salary_expected: body.salary_expected || null,
            additional_information: body.additional_information || null,
            employee_name: body.employee_name || null,
            employee_relationship: body.employee_relationship || null,
            employee_contact_number: body.employee_contact_number || null,
            interviewed_for_which_position: body.interviewed_for_which_position || null,
            interviewed_for_which_location: body.interviewed_for_which_location || null,
            interview_date: body.interview_date || null,
            candidate_name: body.candidate_name || null,
            signature: body.signature || null,
            education_details: body.education_details || [],
            previous_present_employment: body.previous_present_employment || [],
            professional_references: body.professional_references || [],
        };

        const res = await fetch(`${BASE_URL}/api/resource/Application Form`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        if (!res.ok) {
            console.error('Application Form POST error:', res.status, text);
            return NextResponse.json({ error: 'Frappe error', detail: text }, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('Application Form POST error:', error);
        return NextResponse.json({ error: 'Failed to create application form', detail: error?.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

        const body = await request.json();

        const res = await fetch(`${BASE_URL}/api/resource/Application Form/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error('Application Form PUT error:', error);
        return NextResponse.json({ error: 'Failed to update application form', detail: error?.message }, { status: 500 });
    }
}





// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// const BASE_URL =
//     process.env.NEXT_PUBLIC_FRAPPE_BASE_URL!;

// const headers = {
//     Authorization:
//         `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
//     "Content-Type": "application/json",
// };

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();

//         const payload = {
//             ...body
//         };

//         const res = await fetch(
//             `${BASE_URL}/api/resource/Application Form`,
//             {
//                 method: "POST",
//                 headers,
//                 body: JSON.stringify(payload),
//             });

//         const data = await res.json();

//         return NextResponse.json(data, {
//             status: res.status,
//         });

//     } catch (error: any) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.message,
//             },
//             { status: 500 }
//         );
//     }
// }