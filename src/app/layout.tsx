import { Geist } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/Navbar";
import { SITE_CONFIG } from "@/config/config";
import { Toaster } from "@/components/ui/toaster";
import { defaultMetadata } from "@/config/metadata";
import Footer from "@/components/Footer";
const appleTitle = SITE_CONFIG.siteName;
const geist = Geist({
  subsets: ["latin"],
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content={appleTitle} />
      </head>
      <body
        className={`${geist.className} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <Toaster />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
