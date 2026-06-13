/*
 * (c) 2026 Muhammed Ali Bulut, All rights reserved.
 *
 *  Licensed under the Apache License 2.0, see LICENSE file in repository
 *  root for copy file of license. For copyright notices, technical issues,
 *  feedback, or any other related to this code file / project, please contact
 *  me via mamii@mamii.dev or other ways.
 */

import { Geist, Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SITE_CONFIG } from "@/config/config"
import { Toaster } from "@/components/ui/sonner"
import { defaultMetadata } from "@/config/metadata"
import LocaleProvider from "@/i18n/LocaleProvider"
import LayoutShell from "@/components/LayoutShell"
import Script from "next/script";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const appleTitle = SITE_CONFIG.siteName

const geist = Geist({
    subsets: ["latin"],
})

export const metadata = defaultMetadata

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
        <head>
            <meta name="apple-mobile-web-app-title" content={appleTitle} />
        </head>
        <body
            className={`${geist.className} flex min-h-screen flex-col bg-background text-foreground`}
        >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LocaleProvider>
                <Toaster richColors closeButton />
                <LayoutShell>
                    {children}
                </LayoutShell>
            </LocaleProvider>
        </ThemeProvider>
        <Script
          src="https://stats.mamii.dev/script.js"
          data-website-id="485da8eb-fe48-4ae1-9b96-5c6b5af95be3"
          strategy="afterInteractive"
        />
        </body>
        </html>
    )
}
