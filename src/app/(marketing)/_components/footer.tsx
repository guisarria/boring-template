import Link from "next/link"
import { GitHubIcon } from "@/components/ui/icons"

export const Footer = () => (
  <footer className="container z-10 mt-auto flex w-full items-center bg-background py-4 text-muted-foreground text-xs">
    <div className="flex w-full justify-between px-4 sm:px-0">
      <p>© Boring Template</p>
      <div className="flex items-start justify-start gap-x-12">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-foreground text-sm">Legal</h2>
          <ul className="flex flex-col gap-y-2">
            <li>
              <Link href={"/privacy-policy"}>Privacy Policy</Link>
            </li>
            <li>
              <Link href={"/terms-of-service"}>Terms of Service</Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-foreground text-sm">Links</h2>
          <ul className="flex flex-col gap-y-2">
            <li>
              <Link
                className="flex items-center gap-x-2"
                href={"https://github.com/guisarria/boring-template"}
              >
                <GitHubIcon />
                GitHub
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
)
