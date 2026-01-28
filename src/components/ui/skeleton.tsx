import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-r from-transparent via-primary/10 to-transparent dark:via-primary/10",
        "bg-[length:200%_100%]",
        "rounded-none animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton }
