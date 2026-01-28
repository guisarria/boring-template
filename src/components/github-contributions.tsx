import { connection } from "next/server"
import { cache, Suspense } from "react"
import { cn } from "@/lib/utils"

type ContributionLevel = 0 | 1 | 2 | 3 | 4

type ContributionDay = {
  count: number
  date: string
  level: ContributionLevel
}

type ContributionData = {
  contributions: ContributionDay[]
  total: number
}

type GithubContributionsProps = {
  username: string
  year?: number
  showMonths?: boolean
  showWeekdays?: boolean
}

const LEVEL_COLORS = {
  0: "bg-muted dark:bg-card border dark:border-0 border-border",
  1: "bg-emerald-200 dark:bg-emerald-950",
  2: "bg-emerald-300 dark:bg-emerald-900",
  3: "bg-emerald-400 dark:bg-emerald-850",
  4: "bg-emerald-500 dark:bg-emerald-800"
} as const satisfies Record<ContributionLevel, string>

const MONTHS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"] as const
const SKELETON_WEEKS = Array.from({ length: 53 }, (_, i) => `week-${i}`)
const SKELETON_DAYS = Array.from({ length: 7 }, (_, i) => `day-${i}`)

const TOTAL_PATTERN =
  /([0-9,]+)\s+contributions?\s+in\s+(?:the\s+last\s+year|\d{4})/i
const DAY_PATTERN =
  /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="([^"]+)"[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g
const TOOLTIP_PATTERN = /<book-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/book-tip>/g
const COUNT_PATTERN = /^\d+/

const isContributionLevel = (n: number): n is ContributionLevel =>
  Number.isInteger(n) && n >= 0 && n <= 4

const parseContributions = (html: string): ContributionData => {
  const totalMatch = TOTAL_PATTERN.exec(html)
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0

  const tooltips = new Map(
    [...html.matchAll(TOOLTIP_PATTERN)].map(([, id, text]) => [id, text])
  )

  const contributions: ContributionDay[] = []

  for (const [, date, id, levelStr] of html.matchAll(DAY_PATTERN)) {
    const level = Number(levelStr)
    if (!isContributionLevel(level)) {
      continue
    }

    const countMatch = tooltips.get(id)?.match(COUNT_PATTERN)
    contributions.push({
      date,
      level,
      count: countMatch ? Number(countMatch[0]) : 0
    })
  }

  contributions.sort((a, b) => a.date.localeCompare(b.date))

  return { contributions, total }
}

const fetchContributions = cache(
  async (username: string, year: number): Promise<ContributionData> => {
    const response = await fetch(
      `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`,
      {
        headers: {
          accept: "text/html",
          referer: `https://github.com/${username}`,
          "x-requested-with": "XMLHttpRequest"
        },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch contributions for ${username}`)
    }

    return parseContributions(await response.text())
  }
)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

function ContributionCell({ day }: { day: ContributionDay }) {
  return (
    <div
      className={`size-2.5 ${LEVEL_COLORS[day.level]}`}
      title={`${day.count} contributions on ${formatDate(day.date)}`}
    />
  )
}

function WeekdayLabels() {
  return (
    <div
      aria-hidden
      className="mt-2 mr-2 flex flex-col gap-y-3 text-muted-foreground text-xs"
    >
      <span>Mon</span>
      <span>Wed</span>
      <span>Fri</span>
    </div>
  )
}

function MonthLabels({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mt-2 flex items-center justify-center gap-x-24 text-muted-foreground text-xs",
        className
      )}
    >
      {MONTHS.map((month) => (
        <span key={month}>{month}</span>
      ))}
    </div>
  )
}

function ContributionsSkeleton({
  showMonths = true,
  showWeekdays = true
}: {
  showMonths?: boolean
  showWeekdays?: boolean
}) {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-4 w-40 rounded bg-neutral-800" />
      <div className="flex">
        {showWeekdays && <WeekdayLabels />}

        <div className="inline-flex gap-0.75">
          {SKELETON_WEEKS.map((weekKey) => (
            <div className="flex flex-col gap-0.75" key={weekKey}>
              {SKELETON_DAYS.map((dayKey) => (
                <div className="size-2.5 bg-neutral-800" key={dayKey} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {showMonths && <MonthLabels />}
    </div>
  )
}
const getWeekStartPadding = (year: number) => {
  const jan1 = new Date(`${year}-01-01T00:00:00Z`)
  return jan1.getUTCDay()
}

async function ContributionsGrid({
  username,
  year,
  showMonths = true,
  showWeekdays = true
}: GithubContributionsProps) {
  await connection()

  const resolvedYear = year ?? new Date().getFullYear()
  const { contributions, total } = await fetchContributions(
    username,
    resolvedYear
  )

  const jan1 = new Date(`${resolvedYear}-01-01T00:00:00Z`)
  const padding = getWeekStartPadding(resolvedYear)

  const paddingDays: ContributionDay[] = Array.from(
    { length: padding },
    (_, i) => {
      const d = jan1
      d.setUTCDate(jan1.getUTCDate() - (padding - i))
      return {
        date: d.toISOString().slice(0, 10),
        count: 0,
        level: 0
      }
    }
  )

  const days: ContributionDay[] = [...paddingDays, ...contributions]

  while (days.length % 7 !== 0) {
    const lastDay = days.at(-1)
    if (!lastDay) {
      break
    }
    const last = new Date(lastDay.date)
    last.setUTCDate(last.getUTCDate() + 1)
    days.push({
      date: last.toISOString().slice(0, 10),
      count: 0,
      level: 0
    })
  }

  const weeks: ContributionDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <>
      <p className="mb-2 text-muted-foreground text-sm">
        {total.toLocaleString()} contributions in {resolvedYear}
      </p>

      <div className="w-full overflow-x-auto">
        <div className="flex">
          {showWeekdays && <WeekdayLabels />}

          <div className="inline-flex gap-0.75">
            {weeks.map((week) => (
              <div className="flex flex-col gap-0.75" key={week[0].date}>
                {week.map((day) => (
                  <ContributionCell day={day} key={day.date} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showMonths && <MonthLabels />}
    </>
  )
}

export function GithubContributions(props: GithubContributionsProps) {
  return (
    <section aria-label={`GitHub contributions for ${props.username}`}>
      <Suspense fallback={<ContributionsSkeleton />}>
        <ContributionsGrid {...props} />
      </Suspense>
    </section>
  )
}
