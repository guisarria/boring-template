"use client"

import { Edit, Laptop, RectangleEllipsis, Smartphone, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"
import { BoringAvatar } from "@/components/boring-avatar"
import { SignOutButton } from "@/components/forms/sign-out-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth/auth-client"
import type { ActiveSessions, Session, User } from "@/types/auth-types"
import { PrivacySwitch } from "./privacy-switch"

const MIN_PASSWORD_LENGTH = 8

function UserCard(props: {
  session: Session
  activeSessions: ActiveSessions
  privateAccount: boolean
}) {
  const router = useRouter()
  const session = props.session
  const [isTerminating, setIsTerminating] = useState<string>()
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false)
  const { ...user } = session.user

  const parsedSessions = useMemo(() => {
    return props.activeSessions
      .filter((s) => s.userAgent)
      .map((session) => {
        const parser = new UAParser(session.userAgent || "")
        return {
          ...session,
          deviceType: parser.getDevice().type,
          osName: parser.getOS().name || session.userAgent,
          browserName: parser.getBrowser().name
        }
      })
  }, [props.activeSessions])

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
                  initialPrivateAccount={props.privateAccount}
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
                      email: session?.user.email || ""
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
                      }
                    }
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
                      token: s.token
                    })

                    if (res.error) {
                      toast.error(res.error.message)
                    } else {
                      toast.success("Session terminated successfully")
                    }
                    router.refresh()

                    if (s.id === props.session?.session.id) {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/")
                          }
                        }
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
                    if (s.id === props.session?.session.id) {
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

function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [signOutDevices, setSignOutDevices] = useState<boolean>(false)
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="z-10 gap-2" size="sm" variant="outline">
            <RectangleEllipsis />
            Change Password
          </Button>
        }
      />
      <DialogContent className="w-11/12 sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Change your password</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <PasswordInput
            autoComplete="new-password"
            id="current-password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentPassword(e.target.value)
            }
            placeholder="Password"
            value={currentPassword}
          />
          <Label htmlFor="new-password">New Password</Label>
          <PasswordInput
            autoComplete="new-password"
            id="new-password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
            placeholder="New Password"
            value={newPassword}
          />
          <Label htmlFor="password">Confirm Password</Label>
          <PasswordInput
            autoComplete="new-password"
            id="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm Password"
            value={confirmPassword}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={(checked) =>
                checked ? setSignOutDevices(true) : setSignOutDevices(false)
              }
            />
            <p className="text-sm">Sign out from other devices</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match")
                return
              }
              if (newPassword.length < MIN_PASSWORD_LENGTH) {
                toast.error("Password must be at least 8 characters")
                return
              }
              setLoading(true)
              const res = await authClient.changePassword({
                newPassword,
                currentPassword,
                revokeOtherSessions: signOutDevices
              })
              setLoading(false)
              if (res.error) {
                toast.error(
                  res.error.message ||
                    "Couldn't change your password! Make sure it's correct"
                )
              } else {
                setOpen(false)
                toast.success("Password changed successfully")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }
            }}
          >
            {loading ? <Loader /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog({ user }: { user: User }) {
  const [name, setName] = useState<string>()
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, startTransition] = useTransition()
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="w-full gap-2 px-4" size="sm" variant="outline">
            <Edit size={13} />
            Edit user
          </Button>
        }
      />
      <DialogContent className="w-11/12 sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
            }}
            placeholder={user.name}
            required
            type="name"
          />
          <div className="mt-2 grid gap-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="relative flex items-end">
              {imagePreview ? (
                <div className="relative mt-2 mr-4 h-16 w-16 overflow-hidden rounded-sm">
                  <Image
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                    src={imagePreview}
                  />
                </div>
              ) : null}
              <div className="flex w-full items-center gap-2">
                <label htmlFor="image">
                  <Button className="relative w-full" type="button">
                    <Input
                      accept="image/*"
                      className="absolute opacity-0" // 👈 MAGIC LINE
                      id="image"
                      onChange={handleImageChange}
                      type="file"
                    />
                    Upload
                  </Button>
                </label>

                {imagePreview ? (
                  <X
                    className="absolute top-0 -left-2 cursor-pointer rounded-full bg-muted/50"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={() => {
              startTransition(async () => {
                await authClient.updateUser({
                  image: image ? await convertImageToBase64(image) : undefined,
                  name: name ? name : undefined,
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("User updated successfully")
                    },
                    onError: (e) => {
                      toast.error(e.error.message)
                    }
                  }
                })
                startTransition(() => {
                  setName("")
                  router.refresh()
                  setImage(null)
                  setImagePreview(null)
                  setOpen(false)
                })
              })
            }}
          >
            {isLoading ? <Loader /> : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { UserCard }
