import "@/styles/globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Doto, Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { createMetadata } from "@/lib/metadata"

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"]
})

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
})

const fontSerif = Doto({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-serif"
})

export const metadata: Metadata = createMetadata({
  title: {
    template: "%s | Boring Template",
    default: "Boring Template"
  },
  description: "Best template."
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className="touch-manipulation scroll-smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} font-mono tracking-tight antialiased`}
      >
        <QueryProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <SpeedInsights />
              <Toaster closeButton richColors />
            </ThemeProvider>
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  )
}
