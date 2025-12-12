import type React from "react"
import type { Metadata } from "next"

import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const auth = await checkAuth();
    console.log(auth);
    if (!auth) redirect("/Login");
    return <>{children}</>;
}
