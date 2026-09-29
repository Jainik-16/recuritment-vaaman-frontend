// import type React from "react"
// import type { Metadata } from "next"
// import "./globals.css"

// export const metadata: Metadata = {
//   title: "Resume",
//   description: "Resume",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }


import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import RoleGuard from "@/components/RoleGuard"

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RoleGuard>
          {children}
        </RoleGuard>
      </body>
    </html>
  )
}
