"use client"

import { Laptop, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"
import { BoringAvatar } from "@/components/boring-avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Loader } from "@/components/ui/loader"
import { authClient } from "@/modules/auth/auth-client"
import { ChangePassword } from "@/modules/auth/components/change-password-dialog"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"
import type { ActiveSessions, Session } from "@/modules/auth/types"
import { EditUserDialog } from "./edit-user-dialog"
import { PrivacySwitch } from "./privacy-switch"

type UserCardProps = {
  session: Session
  activeSessions: ActiveSessions
  privateAccount: boolean
}

function UserCard({ session, activeSessions, privateAccount }: UserCardProps) {
  const router = useRouter()
  const [isTerminating, setIsTerminating] = useState<string>()
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false)
  const { ...user } = session.user

  const parsedSessions = useMemo(() => {
    return activeSessions
      .filter((s) => s.userAgent)
      .map((session) => {
        const parser = new UAParser(session.userAgent || "")
        return {
          ...session,
          deviceType: parser.getDevice().type,
          osName: parser.getOS().name || session.userAgent,
          browserName: parser.getBrowser().name,
        }
      })
  }, [activeSessions])

  return (
    <Card className="mb-40 w-xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="mb-4 flex items-center gap-x-4">
            <BoringAvatar name={session.user.email} />
            <div className="grid">
              <div className="flex items-center gap-1">
                <p>{session.user.name}</p>
              </div>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-4">
            <EditUserDialog user={user} />
            <SignOutButton className="w-full" />
            <Field>
              <FieldLabel className="inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-border bg-background bg-clip-padding p-4 font-medium text-sm outline-none transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-checked:border-border has-data-checked:bg-border aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:has-data-checked:bg-input/30 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0">
                Make Account Private
                <PrivacySwitch
                  initialPrivateAccount={privateAccount}
                  user={user}
                />
              </FieldLabel>
            </Field>
          </div>
        </div>

        {session.user.emailVerified ? null : (
          <Alert className="my-4">
            <AlertTitle>Verify Your Email Address</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Please verify your email address. Check your inbox for the
              verification email. If you haven't received the email, click the
              button below to resend.
              <Button
                className="mt-2"
                onClick={async () => {
                  await authClient.sendVerificationEmail(
                    {
                      email: session?.user.email || "",
                    },
                    {
                      onRequest() {
                        setEmailVerificationPending(true)
                      },
                      onError(context) {
                        toast.error(context.error.message)
                        setEmailVerificationPending(false)
                      },
                      onSuccess() {
                        toast.success("Verification email sent successfully")
                        setEmailVerificationPending(false)
                      },
                    },
                  )
                }}
                size="sm"
                variant="secondary"
              >
                {emailVerificationPending ? (
                  <Loader />
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex w-max flex-col gap-1 border-l pl-2">
          <p className="font-medium text-xs">Active Sessions</p>
          {parsedSessions.map((s) => (
            <div key={s.id}>
              <div className="flex items-center gap-2 font-medium text-black text-sm dark:text-white">
                {s.deviceType === "mobile" ? (
                  <Smartphone size={16} />
                ) : (
                  <Laptop size={16} />
                )}
                {s.osName}, {s.browserName}
                <Button
                  onClick={async () => {
                    setIsTerminating(s.id)
                    const res = await authClient.revokeSession({
                      token: s.token,
                    })

                    if (res.error) {
                      toast.error(res.error.message)
                    } else {
                      toast.success("Session terminated successfully")
                    }
                    router.refresh()

                    if (s.id === session.session.id) {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/")
                          },
                        },
                      })
                    }
                    setIsTerminating(undefined)
                  }}
                  type="button"
                  variant="destructive-outline"
                >
                  {(() => {
                    if (isTerminating === s.id) {
                      return <Loader />
                    }
                    if (s.id === session.session.id) {
                      return "Sign out"
                    }
                    return "Terminate"
                  })()}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between gap-2">
        <ChangePassword />
      </CardFooter>
    </Card>
  )
}

export { UserCard }
