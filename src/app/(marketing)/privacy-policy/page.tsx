import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const PrivacyPolicy = () => (
  <main className="py-10">
    <Link className="mb-8 flex items-center gap-2 text-sm" href="/">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Link>

    <article
      className={cn(
        "prose prose-neutral dark:prose-invert xl:prose-lg prose:font-sans",
        "prose-headings:font-normal",
        "prose-p:mb-0",
        "prose-strong:font-semibold",
        "prose-a:text-foreground/75 prose-a:underline prose-a:decoration-primary prose-a:underline-offset-2 prose-a:transition-all",
        "hover:prose-a:text-foreground hover:prose-a:decoration-primary",
        "prose-blockquote:not-italic",
        "text-pretty prose-pre:border prose-pre:bg-muted/25"
      )}
    >
      <h1 className="mb-2 font-extrabold text-4xl">Privacy Policy</h1>
      <p className="mb-10">Last Updated: November 3, 2025</p>

      <p>
        Welcome to <strong>Boring Template</strong> (
        <a
          href="https://www.example.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://www.example.com
        </a>
        ). Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your information when you use our website and
        services.
      </p>
      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect the following personal information from users:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Payment information</li>
        </ul>
        <p>We also collect non-personal data through the use of web cookies.</p>
      </section>
      <section>
        <h2>2. Purpose of Data Collection</h2>
        <p>
          We use the information we collect solely for{" "}
          <strong>order processing</strong> and to provide you with our
          services.
        </p>
      </section>
      <section>
        <h2>3. Data Sharing</h2>
        <p>
          We <strong>do not share, sell, or rent</strong> your personal
          information with any third parties.
        </p>
      </section>
      <section>
        <h2>4. Cookies</h2>
        <p>
          We use cookies to enhance your browsing experience and analyze website
          traffic. You can disable cookies through your browser settings if you
          prefer.
        </p>
      </section>
      <section>
        <h2>5. Children's Privacy</h2>
        <p>
          Our services are not directed to children. We do not knowingly collect
          personal information from anyone under the age of 13.
        </p>
      </section>
      <section>
        <h2>6. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make
          significant changes, we will notify users via email.
        </p>
      </section>
      <section>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:
        </p>
        <p className="flex items-center gap-x-2">
          <Mail size={16} />
          <a href="mailto:email@boringtemplate.com">email@boringtemplate.com</a>
        </p>
      </section>
      <p className="mt-10 text-sm">
        © 2025 Boring Template. All rights reserved.
      </p>
    </article>
  </main>
)

export default PrivacyPolicy
