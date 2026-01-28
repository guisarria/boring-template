"use client"

import { Database, KeyRound, Mail, Shield, Users, Zap } from "lucide-react"
import { Cta } from "@/app/(marketing)/_components/cta"
import {
  FeatureCard,
  type FeatureItem
} from "@/app/(marketing)/_components/feature-card"
import { Hero } from "@/app/(marketing)/_components/hero"
import { SectionHeader } from "@/app/(marketing)/_components/section-header"
import {
  TechCard,
  type TechItem
} from "@/app/(marketing)/_components/tech-card"
import {
  BetterAuthIcon,
  DrizzleIcon,
  MotionIcon,
  NeonIcon,
  NextJsIcon,
  ResendIcon,
  TailwindIcon,
  TanStackIcon,
  TypeScriptIcon,
  ZodIcon
} from "@/components/ui/icons"

const TECH_STACK: TechItem[] = [
  {
    name: "Next.js 15",
    description: "React framework with App Router",
    icon: NextJsIcon,
    color: "text-foreground"
  },
  {
    name: "Better Auth",
    description: "Type-safe authentication",
    icon: BetterAuthIcon,
    color: "text-orange-400"
  },
  {
    name: "Drizzle ORM",
    description: "TypeScript ORM for SQL",
    icon: DrizzleIcon,
    color: "text-[#C5F74F]"
  },
  {
    name: "Neon",
    description: "Serverless Postgres",
    icon: NeonIcon,
    color: "text-[#00E699]"
  },
  {
    name: "TanStack Query",
    description: "Async state management",
    icon: TanStackIcon,
    color: "text-[#FF4154]"
  },
  {
    name: "Resend",
    description: "Email delivery API",
    icon: ResendIcon,
    color: "text-foreground"
  },
  {
    name: "TypeScript",
    description: "Type-safe development",
    icon: TypeScriptIcon,
    color: "text-[#3178c6]"
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling",
    icon: TailwindIcon,
    color: "text-[#06B6D4]"
  },
  {
    name: "Zod",
    description: "Schema validation",
    icon: ZodIcon,
    color: "text-[#3068B7]"
  },
  {
    name: "Motion",
    description: "Animation library",
    icon: MotionIcon,
    color: "text-[#FF0088]"
  }
]

const FEATURES: FeatureItem[] = [
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Email/password & OAuth providers with session management and email verification"
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Complete user profiles with username plugin and account linking support"
  },
  {
    icon: Database,
    title: "Database Ready",
    description:
      "Drizzle ORM with Neon Postgres, migrations, and type-safe queries"
  },
  {
    icon: Mail,
    title: "Email System",
    description:
      "Transactional emails with Resend for verification and password reset"
  },
  {
    icon: KeyRound,
    title: "Secure Sessions",
    description: "Cookie-based sessions with caching and automatic refresh"
  },
  {
    icon: Zap,
    title: "Developer Experience",
    description: "Hot reload, type safety, linting with Biome, and Turbo builds"
  }
]

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <Hero />

      <section
        aria-labelledby="tech-heading"
        className="flex flex-col items-center border-border/50 border-t bg-muted/20 py-20"
      >
        <div className="container">
          <SectionHeader
            description="Carefully selected tools that work together seamlessly"
            title="Modern Tech Stack"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {TECH_STACK.map((tech, i) => (
              <TechCard index={i} key={tech.name} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="flex flex-col items-center py-20"
      >
        <div className="container">
          <SectionHeader
            description="Production-ready features out of the box"
            title="Everything You Need"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <FeatureCard feature={feature} index={i} key={feature.title} />
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </div>
  )
}
