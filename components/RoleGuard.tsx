"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
    canSiteHRAccessRoute,
    isSiteHR,
} from "@/lib/permissions"

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8002"

interface RoleGuardProps {
    children: React.ReactNode
}

export default function RoleGuard({
    children,
}: RoleGuardProps) {
    const router = useRouter()
    const pathname = usePathname()

    const [checking, setChecking] = useState(true)
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        // Public pages do not need permission checking
        const isPublicRoute =
            pathname === "/Login" ||
            pathname.startsWith("/document-verify/")

        if (isPublicRoute) {
            setAllowed(true)
            setChecking(false)
            return
        }

        const checkAccess = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/method/resume.api.job_opening.get_current_user_roles`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        "Failed to check user permissions"
                    )
                }

                const result = await response.json()
                const data = result?.message

                if (!data?.success) {
                    throw new Error(
                        data?.message ||
                        "Unable to check permissions"
                    )
                }

                /*
                 * Use actual assigned roles returned by backend.
                 *
                 * Do NOT use data.roles here because
                 * Administrator gets all Frappe roles automatically.
                 */
                const assignedRoles =
                    data.assigned_roles || []

                // Site HR → restricted access
                if (isSiteHR(assignedRoles)) {
                    if (canSiteHRAccessRoute(pathname)) {
                        setAllowed(true)
                        return
                    }

                    router.replace("/home")
                    return
                }

                // Any user without Site HR role
                // → full access
                setAllowed(true)

            } catch (error) {
                console.error(
                    "Permission check error:",
                    error
                )

                router.replace("/Login")
            } finally {
                setChecking(false)
            }
        }

        checkAccess()
    }, [pathname, router])

    if (checking) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Checking permissions...
            </div>
        )
    }

    if (!allowed) {
        return null
    }

    return <>{children}</>
}