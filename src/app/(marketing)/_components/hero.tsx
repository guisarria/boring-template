"use client"

import { CircleDotDashedIcon, Zap } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/ui/icons"
import { HeroAssetAscii } from "./hero-asset-ascii"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(218,112,44,0.08),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 size-72 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 size-72 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-muted-foreground text-sm backdrop-blur-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CircleDotDashedIcon aria-hidden className="size-4 text-orange-400" />
          <span>Production-ready starter template</span>
        </motion.div>

        <h1
          className="max-w-4xl text-center font-serif text-4xl leading-tight tracking-tighter md:text-6xl"
          id="hero-heading"
        >
          <span className="block">Ship faster with</span>
          <span className="bg-linear-to-r from-orange-400 via-orange-300 to-cyan-400 bg-clip-text text-transparent">
            Boring Template
          </span>
        </h1>

        <HeroAssetAscii className="select-none bg-linear-to-r from-orange-400 via-orange-600 to-cyan-800 bg-clip-text text-transparent" />

        <p className="max-w-lg text-pretty px-4 text-center text-md text-muted-foreground md:max-w-3xl md:text-xl">
          A minimal, type-safe Next.js template with authentication, database,
          and email built-in. Start building your product, not your
          infrastructure.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Button
            className="h-11 gap-2 px-6"
            nativeButton={false}
            render={<Link href="/sign-up" />}
          >
            Get Started
            <Zap aria-hidden className="size-4" />
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
            variant="outline"
          >
            <GitHubIcon aria-hidden className="size-4" />
            View Source
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
