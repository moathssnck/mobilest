import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment Portal",
  description: "خدمات دفع الفواتير وإعادة التعبئة",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>

      </head>
      <body>{children}</body>
    </html>
  )
}
