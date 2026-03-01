export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 font-bold text-2xl">Page Not Found</h2>
        <p className="mb-4 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <a
          className="text-primary underline underline-offset-4 hover:text-primary/90"
          href="/"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}
