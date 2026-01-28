import { CornerUpLeftIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { serverActiveSessions, serverSession } from "@/lib/auth/server"
import { getUserSettings } from "@/server/users"
import { UserCard } from "../_components/user-card"

async function Dashboard() {
  const { ...session } = await serverSession()
  const activeSessions = await serverActiveSessions()
  const userSettings = await getUserSettings(session.user.id)

  return (
    <div className="container relative mx-auto flex h-full flex-col items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center gap-y-12">
        <Link
          className="flex items-center gap-x-2 self-start text-muted-foreground text-sm"
          href={"/dashboard"}
        >
          <CornerUpLeftIcon size={16} /> Dashboard
        </Link>
        <UserCard
          activeSessions={activeSessions}
          privateAccount={
            userSettings.success ? userSettings.data[0].privateAccount : false
          }
          session={session}
        />
        {/* <UserLanguagesForm
          allLanguages={allLanguages}
          userId={userId}
          userLanguages={userLanguages ?? []}
        /> */}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  )
}
