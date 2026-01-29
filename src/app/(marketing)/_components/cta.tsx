"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { GitHubIcon } from "@/components/ui/icons"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export function Cta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="flex flex-col items-center border-border/50 border-t bg-[radial-gradient(ellipse_at_center,rgba(218,112,44,0.08),transparent_70%)] py-20"
    >
      <div className="container">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
          initial="hidden"
          transition={{ duration: 0.5 }}
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView="visible"
        >
          <h2
            className="mb-4 bg-linear-to-r from-orange-400 via-orange-300 to-cyan-400 bg-clip-text font-serif text-4xl text-transparent tracking-tight sm:text-5xl"
            id="cta-heading"
          >
            Ready to build?
          </h2>
          <p className="text-muted-foreground">
            Clone the repository and start shipping in minutes.
          </p>

          <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 font-mono text-sm lg:max-w-lg">
            <span aria-hidden className="select-none text-muted-foreground">
              $
            </span>
            <code className="flex-1 select-all text-left">
              git clone github.com/guisarria/boring-template
            </code>
            <CopyButton textToCopy="git clone github.com/guisarria/boring-template" />
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="h-11 px-6"
              nativeButton={false}
              render={<Link href="/sign-up" />}
            >
              Start Building
            </Button>
            <Button
              className="h-11 gap-2 px-6"
              nativeButton={false}
              render={
                <Link
                  href="https://github.com/guisarria/boring-template"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              }
              variant="ghost"
            >
              <GitHubIcon aria-hidden className="size-4" />
              Star on GitHub
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
