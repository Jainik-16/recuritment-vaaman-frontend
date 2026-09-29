// import { NextResponse } from 'next/server';

// const getAuthHeaders = () => ({
//     'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
//     'Content-Type': 'application/json'
// });

// const BASE_URL = 'https://ats.vaaman.in';

// // POST: Create new Application Declaration
// export async function POST(request: Request) {
//     try {
//         const body = await request.json();

//         // Exact field names: name1, date, place, signature (Small Text)
//         const payload = {
//             custom_applicant_email: body.custom_applicant_email || null,
//             name1: body.name1 || null,
//             date: body.date || null,
//             place: body.place || null,
//             signature: body.signature || null,  // base64 PNG string stored in Small Text
//         };

//         const res = await fetch(`${BASE_URL}/api/resource/Application Declaration`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(payload),
//         });
//         const data = await res.json();
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         console.error('Declaration POST error:', error);
//         return NextResponse.json({ error: 'Failed to create declaration' }, { status: 500 });
//     }
// }

// // PUT: Update existing Declaration
// export async function PUT(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const id = searchParams.get('id');
//         const body = await request.json();

//         if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

//         const res = await fetch(`${BASE_URL}/api/resource/Application Declaration/${encodeURIComponent(id)}`, {
//             method: 'PUT',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(body),
//         });
//         const data = await res.json();
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         console.error('Declaration PUT error:', error);
//         return NextResponse.json({ error: 'Failed to update declaration' }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';

const getAuthHeaders = () => ({
    'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    'Content-Type': 'application/json'
});

const BASE_URL = 'https://ats.vaaman.in';

async function resolveJobApplicantOwnerByEmail(email: string | null): Promise<string | null> {
    if (!email) return null;
    try {
        const url = `${BASE_URL}/api/resource/Job Applicant?filters=[["email_id","=","${email}"]]&fields=["owner"]&limit_page_length=1`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        return data?.data?.[0]?.owner || null;
    } catch (err) {
        console.error('[DECLARATION] Failed to resolve Job Applicant owner by email:', err);
        return null;
    }
}

async function forceSetOwner(doctype: string, name: string, owner: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/method/resume.api.api.set_document_owner`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ doctype, name, owner }),
        });
        const data = await res.json();
        console.log(`[DECLARATION] Owner force-set response for ${doctype} ${name}:`, JSON.stringify(data));
    } catch (err) {
        console.error(`[DECLARATION] Failed to force-set owner for ${doctype} ${name}:`, err);
    }
}

// POST: Create new Application Declaration
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const payload = {
            custom_applicant_email: body.custom_applicant_email || null,
            name1: body.name1 || null,
            date: body.date || null,
            place: body.place || null,
            signature: body.signature || null,
        };

        const resolvedOwner = await resolveJobApplicantOwnerByEmail(payload.custom_applicant_email);

        const res = await fetch(`${BASE_URL}/api/resource/Application Declaration`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await res.json();

        const createdName = data?.data?.name;
        if (createdName && resolvedOwner) {
            await forceSetOwner('Application Declaration', createdName, resolvedOwner);
            if (data?.data) data.data.owner = resolvedOwner;
        }

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

        let email = body.custom_applicant_email;
        if (!email) {
            try {
                const existingRes = await fetch(
                    `${BASE_URL}/api/resource/Application Declaration/${encodeURIComponent(id)}?fields=["custom_applicant_email"]`,
                    { headers: getAuthHeaders() }
                );
                const existingData = await existingRes.json();
                email = existingData?.data?.custom_applicant_email || null;
            } catch (err) {
                console.error('[DECLARATION] Failed to fetch existing custom_applicant_email:', err);
            }
        }

        const resolvedOwner = await resolveJobApplicantOwnerByEmail(email);

        const res = await fetch(`${BASE_URL}/api/resource/Application Declaration/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (resolvedOwner) {
            await forceSetOwner('Application Declaration', id, resolvedOwner);
            if (data?.data) data.data.owner = resolvedOwner;
        }

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Declaration PUT error:', error);
        return NextResponse.json({ error: 'Failed to update declaration' }, { status: 500 });
    }
}
