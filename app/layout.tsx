import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import { siteMetadata } from "@/utils/config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
