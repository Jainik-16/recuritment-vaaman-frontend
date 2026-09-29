// import { NextResponse } from 'next/server';

// const getAuthHeaders = () => ({
//     'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
//     'Content-Type': 'application/json'
// });

// const BASE_URL = 'https://ats.vaaman.in'; 

// // GET: Fetch existing document
// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const applicantName = searchParams.get('applicant_name');

//     if (!applicantName) return NextResponse.json({ error: 'Missing applicant_name' }, { status: 400 });

//     try {
//         const url = `${BASE_URL}/api/resource/Applicant Document?filters=[["applicant_name","=","${applicantName}"]]&fields=["*"]&limit_page_length=0`;
//         const res = await fetch(url, { headers: getAuthHeaders() });
//         const data = await res.json();
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
//     }
// }

// // POST: Create a new document
// export async function POST(request: Request) {
//     try {
//         const body = await request.json();
//         const res = await fetch(`${BASE_URL}/api/resource/Applicant Document`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(body),
//         });
//         const data = await res.json();
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
//     }
// }

// // PUT: Update an existing document
// export async function PUT(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const id = searchParams.get('id');
//         const body = await request.json();

//         if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

//         const res = await fetch(`${BASE_URL}/api/resource/Applicant Document/${id}`, {
//             method: 'PUT',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(body),
//         });
//         const data = await res.json();
//         return NextResponse.json(data, { status: res.status });
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
//     }
// }

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
        console.log('[APPLICANT-DOC POST] Incoming body:', JSON.stringify(body));

        let resolvedOwner: string | null = null;

        if (body.applicant_name) {
            try {
                const applicantUrl = `${BASE_URL}/api/resource/Job Applicant/${encodeURIComponent(body.applicant_name)}?fields=["owner"]`;
                const applicantRes = await fetch(applicantUrl, { headers: getAuthHeaders() });
                const applicantData = await applicantRes.json();
                resolvedOwner = applicantData?.data?.owner || null;
                console.log('[APPLICANT-DOC POST] Resolved jobApplicantOwner:', resolvedOwner);

                if (resolvedOwner) {
                    body.owner = resolvedOwner;
                }
            } catch (err) {
                console.error('[APPLICANT-DOC POST] Failed to fetch Job Applicant owner:', err);
            }
        }

        const res = await fetch(`${BASE_URL}/api/resource/Applicant Document`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log('[APPLICANT-DOC POST] Frappe create response:', JSON.stringify(data));

        // 👇 NAYA BLOCK — REST insert ne owner ignore kar diya hoga,
        // isliye ab explicitly force-set karo custom Frappe method se
        const createdName = data?.data?.name;
        if (createdName && resolvedOwner) {
            try {
                const ownerFixRes = await fetch(
                    `${BASE_URL}/api/method/resume.api.api.set_document_owner`,
                    {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ doctype: 'Applicant Document', name: createdName, owner: resolvedOwner }),
                    }
                );
                const ownerFixData = await ownerFixRes.json();
                console.log('[APPLICANT-DOC POST] Owner force-set response:', JSON.stringify(ownerFixData));

                // response mein bhi sahi owner reflect karwa do
                if (data?.data) data.data.owner = resolvedOwner;
            } catch (err) {
                console.error('[APPLICANT-DOC POST] Failed to force-set owner:', err);
            }
        }

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('[APPLICANT-DOC POST] Error:', error);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}


// PUT: Update an existing document
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        console.log('[APPLICANT-DOC PUT] id:', id, 'Incoming body:', JSON.stringify(body));

        if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });

        let applicantName = body.applicant_name;
        let resolvedOwner: string | null = null;

        if (!applicantName) {
            try {
                const existingRes = await fetch(
                    `${BASE_URL}/api/resource/Applicant Document/${id}?fields=["applicant_name"]`,
                    { headers: getAuthHeaders() }
                );
                const existingData = await existingRes.json();
                applicantName = existingData?.data?.applicant_name;
            } catch (err) {
                console.error('[APPLICANT-DOC PUT] Failed to fetch existing applicant_name:', err);
            }
        }

        if (applicantName) {
            try {
                const applicantUrl = `${BASE_URL}/api/resource/Job Applicant/${encodeURIComponent(applicantName)}?fields=["owner"]`;
                const applicantRes = await fetch(applicantUrl, { headers: getAuthHeaders() });
                const applicantData = await applicantRes.json();
                resolvedOwner = applicantData?.data?.owner || null;
                console.log('[APPLICANT-DOC PUT] Resolved jobApplicantOwner:', resolvedOwner);

                if (resolvedOwner) {
                    body.owner = resolvedOwner;
                }
            } catch (err) {
                console.error('[APPLICANT-DOC PUT] Failed to fetch Job Applicant owner:', err);
            }
        }

        const res = await fetch(`${BASE_URL}/api/resource/Applicant Document/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log('[APPLICANT-DOC PUT] Frappe update response:', JSON.stringify(data));

        // 👇 NAYA BLOCK — update ke baad bhi owner force-set karo
        if (resolvedOwner) {
            try {
                const ownerFixRes = await fetch(
                    `${BASE_URL}/api/method/resume.api.api.set_applicant_document_owner`,
                    {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ name: id, owner: resolvedOwner }),
                    }
                );
                const ownerFixData = await ownerFixRes.json();
                console.log('[APPLICANT-DOC PUT] Owner force-set response:', JSON.stringify(ownerFixData));

                if (data?.data) data.data.owner = resolvedOwner;
            } catch (err) {
                console.error('[APPLICANT-DOC PUT] Failed to force-set owner:', err);
            }
        }

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('[APPLICANT-DOC PUT] Error:', error);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}
