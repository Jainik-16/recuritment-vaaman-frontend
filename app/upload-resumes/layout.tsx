
// 'use client'
// import type React from "react"
// import { Loader2 } from "lucide-react";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { checkAuth } from "@/lib/checkAuth";


// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode
// }>) {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//     useEffect(() => {
//         async function authenticate() {
//             const auth = await checkAuth();

//             if (!auth) {

//                 setIsAuthenticated(false);
//                 router.push("/Login");
//             } else {

//                 setIsAuthenticated(true);
//             }
//         }

//         authenticate();
//     }, [router]);

//     if (isAuthenticated === null) {

//         return <div className="bg-blue-50 w-full h-screen border border-blue-200 rounded-lg p-4 flex items-center justify-center gap-3">
//             <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
//             <span className="text-sm font-medium text-blue-800">Checking Authentication...</span>
//         </div>
//     }
//     if (isAuthenticated === true) {
//         return <>{children}</>;
//     }

//     return null;
// }

'use client'
import type React from "react"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { checkAuth } from "@/lib/checkAuth"

const PUBLIC_PREFIXES = ["/Login", "/document-verify"]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter()
    const pathname = usePathname()
    const isPublic = PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + "/"))
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        if (isPublic) return
        async function authenticate() {
            const auth = await checkAuth()
            if (!auth) {
                setIsAuthenticated(false)
                router.push("/Login")
            } else {
                setIsAuthenticated(true)
            }
        }
        authenticate()
    }, [router, isPublic])

    // Public pages: auth check skip
    if (isPublic) return <>{children}</>

    if (isAuthenticated === null) {
        return (
            <div className="bg-blue-50 w-full h-screen border border-blue-200 rounded-lg p-4 flex items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-800">Checking Authentication...</span>
            </div>
        )
    }
    if (isAuthenticated === true) return <>{children}</>
    return null
}