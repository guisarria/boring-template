import { CornerUpLeftIcon } from "lucide-react"
import Link from "next/link"
import {
  getServerActiveSessions,
  getServerSession,
} from "@/modules/auth/server"
import { getUserSettings } from "@/modules/users/actions"
import { UserCard } from "@/modules/users/components/user-card"

export default async function Page() {
  const { ...session } = await getServerSession()
  const activeSessions = await getServerActiveSessions()
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
