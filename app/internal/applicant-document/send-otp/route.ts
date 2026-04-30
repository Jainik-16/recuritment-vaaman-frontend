
import { NextResponse } from "next/server";

const BASE_URL = "https://ats.octavision.in";

const headers = {
    Authorization:
        `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    "Content-Type": "application/json",
};

export async function POST(req: Request) {
    try {
        const { email, manual } = await req.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Email is required"
            });
        }

        // GET OLD OTP ROWS
        const checkRes = await fetch(
            `${BASE_URL}/api/resource/Applicant OTP?filters=[["email","=","${email}"]]&fields=["name","creation"]`,
            { headers }
        );

        const checkData = await checkRes.json();

        const rows = Array.isArray(checkData.data)
            ? checkData.data
            : [];

        const now = new Date().getTime();

        const recent = rows.filter((item: any) => {
            const created = new Date(item.creation).getTime();
            return now - created < 15 * 60 * 1000;
        });

        // AUTO = first time
        // MANUAL = resend click
        // total allowed = 1 auto + 3 resend

        if (manual && recent.length >= 4) {
            return NextResponse.json({
                success: false,
                message: "Only 3 OTP requests allowed in 15 mins"
            });
        }

        // // DELETE OLD OTPS OF SAME EMAIL
        // for (const row of rows) {
        //     await fetch(
        //         `${BASE_URL}/api/resource/Applicant OTP/${row.name}`,
        //         {
        //             method: "DELETE",
        //             headers
        //         }
        //     );
        // }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // SAVE NEW OTP
        const saveRes = await fetch(
            `${BASE_URL}/api/resource/Applicant OTP`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email,
                    otp
                }),
            }
        );

        const saveData = await saveRes.json();

        if (!saveRes.ok) {
            return NextResponse.json({
                success: false,
                message: saveData.message || "OTP save failed"
            });
        }

        // SEND EMAIL
        const emailRes = await fetch(
            `${BASE_URL}/api/method/resume.api.api.send_otp_email`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email,
                    otp
                }),
            }
        );

        const emailData = await emailRes.json();

        if (!emailRes.ok) {
            return NextResponse.json({
                success: false,
                message:
                    emailData.message || "Email sending failed"
            });
        }

        return NextResponse.json({
            success: true,
            expires_in: 900
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message:
                error.message || "Failed to send OTP"
        });
    }
}
