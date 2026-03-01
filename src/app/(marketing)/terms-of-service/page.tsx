import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TermsOfService = () => (
  <main className="py-10">
    <Link className="mb-8 flex items-center gap-2 text-sm" href="/">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Link>

    <article
      className={cn(
        "prose prose-neutral dark:prose-invert xl:prose-lg prose:font-sans",
        "prose-headings:font-normal",
        "prose-p:mb-0",
        "prose-strong:font-semibold",
        "prose-a:text-foreground/75 prose-a:underline prose-a:decoration-primary prose-a:underline-offset-2 prose-a:transition-all",
        "hover:prose-a:text-foreground hover:prose-a:decoration-primary",
        "prose-blockquote:not-italic",
        "text-pretty prose-pre:border prose-pre:bg-muted/25",
      )}
    >
      <h1>Terms of Service</h1>
    </article>
  </main>
)

export default TermsOfService
