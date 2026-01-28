"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GlobeIcon, LockIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import type { Page } from "@/db/schemas/pages"
import { cn } from "@/lib/utils"
import { deletePage } from "@/server/pages"

type PageCardProps = {
  page: Page
}

export default function PageCard({ page }: PageCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { isPending, mutateAsync: handleDeletePage } = useMutation({
    mutationFn: deletePage,
    mutationKey: ["page", page.id],
    onSuccess: () => {
      toast.success("Page deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["user-books"] })
      queryClient.invalidateQueries({ queryKey: ["pages", page.bookId] })
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to delete page")
    },
    onSettled: () => {
      setIsOpen(false)
    }
  })

  return (
    <Card className={cn("w-3xs")}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="truncate text-xl">{page.title}</CardTitle>
        {page.isPublic ? (
          <Badge variant={"outline"}>
            <GlobeIcon
              absoluteStrokeWidth
              className="text-cyan-300"
              data-icon="inline-start"
            />
            Public
          </Badge>
        ) : (
          <Badge variant={"outline"}>
            <LockIcon
              absoluteStrokeWidth
              className="text-orange-400"
              data-icon="inline-start"
            />
            Private
          </Badge>
        )}
      </CardHeader>

      <CardContent className="text-muted-foreground text-sm">
        <p>Last updated: {page.updatedAt.toLocaleDateString()}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-x-2">
        <Link href={`/dashboard/book/${page.bookId}/page/${page.id}`} prefetch>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>

        <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
          <AlertDialogTrigger
            render={
              <Button
                disabled={isPending}
                size="sm"
                variant="destructive-outline"
              >
                {isPending ? <Loader /> : <Trash2 className="size-4" />}
              </Button>
            }
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                render={<Button variant="outline">Cancel</Button>}
              />
              <AlertDialogAction
                disabled={isPending}
                onClick={() => handleDeletePage(page.id)}
              >
                {isPending ? <Loader /> : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
