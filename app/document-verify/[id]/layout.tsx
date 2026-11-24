import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Upload Document",
}

export default function DocumentVerifyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}