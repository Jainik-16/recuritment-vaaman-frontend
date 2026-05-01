// import { NextResponse } from "next/server";

// const BASE_URL = "https://ats.octavision.in";

// const headers = {
//     Authorization: `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
//     "Content-Type": "application/json",
// };

// export async function POST(req: Request) {
//     try {
//         const { email, otp } = await req.json();

//         // Find matching OTP
//         const url =
//             `${BASE_URL}/api/resource/Applicant OTP?filters=` +
//             `[["email","=","${email}"],["otp","=","${otp}"]]&fields=["name"]`;

//         const res = await fetch(url, { headers });

//         const data = await res.json();

//         const rows = Array.isArray(data.data)
//             ? data.data
//             : [];

//         if (rows.length === 0) {
//             return NextResponse.json({
//                 verified: false
//             });
//         }

//         const docName = rows[0].name;

//         // DELETE OTP AFTER VERIFY
//         const deleteRes = await fetch(
//             `${BASE_URL}/api/resource/Applicant OTP/${docName}`,
//             {
//                 method: "DELETE",
//                 headers
//             }
//         );

//         if (!deleteRes.ok) {
//             console.log("OTP delete failed");
//         }

//         return NextResponse.json({
//             verified: true
//         });

//     } catch (error: any) {
//         return NextResponse.json({
//             verified: false,
//             message: error.message
//         });
//     }
// }







import { NextResponse } from "next/server";

const BASE_URL = "https://ats.vaaman.in";

const headers = {
    Authorization:
        `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    "Content-Type": "application/json",
};

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({
                verified: false,
                message: "Email and OTP required"
            });
        }

        // GET OTP ROWS FOR EMAIL
        const res = await fetch(
            `${BASE_URL}/api/resource/Applicant OTP?filters=[["email","=","${email}"]]&fields=["name","otp","creation"]&order_by=creation desc`,
            { headers }
        );

        const data = await res.json();

        const rows = Array.isArray(data.data)
            ? data.data
            : [];

        if (rows.length === 0) {
            return NextResponse.json({
                verified: false,
                message: "OTP not found"
            });
        }

        // USE LATEST OTP ONLY
        const latest = rows[0];

        // CHECK OTP MATCH
        if (latest.otp !== otp) {
            return NextResponse.json({
                verified: false,
                message: "Invalid OTP"
            });
        }

        // CHECK EXPIRY (15 MINUTES)
        // const created = new Date(
        //     latest.creation
        // ).getTime();

        // const now = new Date().getTime();

        // const diff = now - created;

        // if (diff > 15 * 60 * 1000) {
        //     return NextResponse.json({
        //         verified: false,
        //         message: "OTP expired"
        //     });
        // }

        // DELETE ALL OTPS OF THIS EMAIL
        for (const row of rows) {
            await fetch(
                `${BASE_URL}/api/resource/Applicant OTP/${row.name}`,
                {
                    method: "DELETE",
                    headers
                }
            );
        }

        return NextResponse.json({
            verified: true
        });

    } catch (error: any) {
        return NextResponse.json({
            verified: false,
            message:
                error.message || "OTP verification failed"
        });
    }
}
