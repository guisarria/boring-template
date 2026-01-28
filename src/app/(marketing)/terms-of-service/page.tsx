import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TermsOfService = () => (
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
      <h1 className="mb-2 font-extrabold text-4xl">Terms & Services</h1>
      <p className="mb-10">Last Updated: November 3, 2025</p>

      <p>
        Welcome to <strong>Boring Template</strong> (
        <a
          href="https://boringtemplate.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://boringtemplate.com
        </a>
        ). These Terms & Services ("Terms") govern your use of our website and
        services. By using our website, you agree to these Terms.
      </p>

      <section>
        <h2>1. Description of Service</h2>
        <p>
          Better Auth Template is a starter template for building authenticated
          web applications. It provides a foundation with user authentication,
          organization management, and database integration that developers can
          build upon for their own projects.
        </p>
      </section>

      <section>
        <h2>2. Ownership and License</h2>
        <p>
          When you purchase a package, you receive full ownership rights to use,
          modify, and build upon the provided code for your own personal or
          commercial projects. You{" "}
          <strong>
            do not have the right to resell, redistribute, or sublicense
          </strong>{" "}
          the code in whole or in part.
        </p>
      </section>

      <section>
        <h2>3. Refund Policy</h2>
        <p>
          You may request a <strong>full refund within 7 days</strong> of your
          purchase. After this period, all sales are final.
        </p>
      </section>

      <section>
        <h2>4. User Data Collection</h2>
        <p>We collect the following personal information:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Payment information</li>
        </ul>
        <p>
          We also collect non-personal data through the use of web cookies. For
          more details, please review our{" "}
          <a
            href="https://boringtemplate.com/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. Limitation of Liability</h2>
        <p>
          Boring Template is not responsible for any direct, indirect,
          incidental, or consequential damages resulting from the use or
          inability to use our services or products.
        </p>
      </section>

      <section>
        <h2>6. Updates to the Terms</h2>
        <p>
          We may update these Terms from time to time. If significant changes
          are made, users will be notified via email.
        </p>
      </section>

      <section>
        <h2>7. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws
          of the <strong>United States</strong>, without regard to its conflict
          of law principles.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfService
