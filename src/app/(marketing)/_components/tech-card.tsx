"use client"

import { motion } from "motion/react"
import type { ComponentProps, ComponentType } from "react"
export type TechItem = {
  name: string
  description: string
  icon: ComponentType<ComponentProps<"svg">>
  color: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export function TechCard({ tech, index }: { tech: TechItem; index: number }) {
  const Icon = tech.icon
  return (
    <motion.article
      className="group flex flex-col items-center gap-3 rounded-xl border border-transparent bg-background/50 p-6 transition-[border-color,background-color] hover:border-border hover:bg-background"
      initial="hidden"
      transition={{ duration: 0.4, delay: index * 0.05 }}
      variants={fadeUp}
      viewport={{ once: true }}
      whileInView="visible"
    >
      <div
        className={`flex size-12 items-center justify-center rounded-lg bg-muted/50 transition-transform group-hover:scale-110 ${tech.color}`}
      >
        <Icon aria-hidden className="size-7" />
      </div>
      <div className="text-center">
        <h3 className="font-medium text-sm">{tech.name}</h3>
        <p className="mt-1 text-muted-foreground text-xs">{tech.description}</p>
      </div>
    </motion.article>
  )
}
