'use client'
import type React from "react"
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter();
    const pathname = usePathname(); // Get the current route
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        async function authenticate() {
            // Must perfectly match the middleware logic
            const isPublicRoute = 
                pathname === "/Login" || 
                pathname.startsWith("/document-verify/");

            // If it's a dynamic public route, bypass the auth check entirely
            if (isPublicRoute) {
                setIsAuthenticated(true);
                return;
            }

            // Otherwise, proceed with the normal auth check
            const auth = await checkAuth();
            console.log('Auth check result:', auth);

            if (!auth) {
                setIsAuthenticated(false);
                router.push("/Login");
            } else {
                setIsAuthenticated(true);
            }
        }

        authenticate();
    }, [router, pathname]);


    if (isAuthenticated === null) {
        return (
            <div className="bg-blue-50 w-full h-screen border border-blue-200 rounded-lg p-4 flex items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-800">Checking Authentication...</span>
            </div>
        );
    }

    if (isAuthenticated === true) {
        return <>{children}</>;
    }

    return null;
}