import "@/styles/globals.css"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex h-screen w-full flex-col items-center overflow-x-hidden">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
