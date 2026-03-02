import "@/styles/globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Doto, Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { createMetadata } from "@/lib/metadata"

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

const fontSerif = Doto({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = createMetadata({
  title: {
    template: "%s | Boring Template",
    default: "Boring Template",
  },
  description: "Best template.",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className="touch-manipulation scroll-smooth"
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} font-mono tracking-tight antialiased`}
      >
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
      </body>
    </html>
  )
}
