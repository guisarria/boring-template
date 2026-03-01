import * as motion from "motion/react-client"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function SectionHeader({
  title,
  description,
  id,
}: {
  title: string
  description: string
  id?: string
}) {
  return (
    <motion.header
      className="mb-12 text-center"
      initial="hidden"
      transition={{ duration: 0.5 }}
      variants={fadeUp}
      viewport={{ once: true }}
      whileInView="visible"
    >
      <h2
        className="mb-4 bg-linear-to-r from-orange-400 via-orange-300 to-cyan-400 bg-clip-text font-serif text-4xl text-transparent tracking-tight sm:text-5xl"
        id={id}
      >
        {title}
      </h2>
      <p className="mx-auto max-w-xl text-muted-foreground">{description}</p>
    </motion.header>
  )
}
