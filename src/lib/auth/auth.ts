import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { username } from "better-auth/plugins"
import { Resend } from "resend"
import { db } from "@/db/index"
import { schema } from "@/db/schemas"
import { PasswordResetEmail } from "@/lib/email/password-reset-email"
import { VerificationEmail } from "@/lib/email/verification-email"
import { env } from "@/lib/env"

const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
  appName: "Boring Template",
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.NEXT_PUBLIC_SERVER_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"]
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "boringtemplate <email@boringtemplate.com>",
        to: [user.email],
        subject: "Verify your email address",
        react: VerificationEmail({ userName: user.name, verificationUrl: url })
      })
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "boringtemplate <email@boringtemplate.com>",
        to: [user.email],
        subject: "Reset your password",
        react: PasswordResetEmail({
          userName: user.email,
          resetUrl: url,
          requestTime: new Date().toLocaleString()
        })
      })
    }
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [
    nextCookies(),
    username({
      displayUsernameNormalization: (displayUsername) =>
        displayUsername.toLowerCase(),
      validationOrder: {
        displayUsername: "post-normalization"
      }
    })
  ]
})
