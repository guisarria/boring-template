import { Footer } from "./_components/footer"
import { Header } from "./_components/header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen w-full flex-col items-center overflow-x-hidden">
      <Header />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}
