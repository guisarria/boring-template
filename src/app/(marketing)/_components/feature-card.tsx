"use client"

import { motion } from "motion/react"
import type { ComponentType } from "react"
export type FeatureItem = {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export function FeatureCard({
  feature,
  index
}: {
  feature: FeatureItem
  index: number
}) {
  const Icon = feature.icon
  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-[border-color] hover:border-border"
      initial="hidden"
      transition={{ duration: 0.4, delay: index * 0.08 }}
      variants={fadeUp}
      viewport={{ once: true }}
      whileInView="visible"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-8 size-24 rounded-full bg-orange-500/5 blur-2xl transition-[background-color] group-hover:bg-orange-500/10"
      />
      <div className="relative">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          <Icon aria-hidden className="size-5" />
        </div>
        <h3 className="mb-2 bg-linear-to-r from-orange-400 to-cyan-800 bg-clip-text font-medium text-transparent">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.article>
  )
}
