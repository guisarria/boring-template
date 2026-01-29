import "@/styles/globals.css"
import { Footer } from "./_components/footer"
import { Header } from "./_components/header"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex h-screen w-screen flex-col items-center overflow-x-hidden">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
