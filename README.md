# Boring Template

A starter template for building authenticated web applications with [Better Auth](https://better-auth.com) and [Next.js](https://nextjs.org).

<br />

![App Screenshot](public/screenshot.png)

<br />

## Features

- **[Email & Password](https://www.better-auth.com/docs/basic-usage#email-password)**: Simple and secure authentication
- **[Multi-Factor Authentication (MFA)](https://www.better-auth.com/docs/plugins/2fa)**: Extra security layer
- **[Password Reset](https://www.better-auth.com/docs/concepts/email#password-reset-email)**: Password recovery flow
- **[Email Verification](https://www.better-auth.com/docs/concepts/email#email-verification)**: Email address verification
- **[Roles & Permissions](https://www.better-auth.com/docs/plugins/admin#role)**: Access control
- **[Session Management](https://www.better-auth.com/docs/concepts/session-management)**: Session handling

## Getting Started

### Prerequisites

1. **Clone the repo**:

   ```bash
   git clone https://github.com/guisarria/boring-template
   cd your-repo
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Configure your database connection and auth settings in `.env`.

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack & Libraries

### Core

- **[Next.js 16](https://nextjs.org/)** - React Framework
- **[Better Auth](https://better-auth.com/)** - Authentication
- **[Drizzle ORM](https://orm.drizzle.team/)** - Database ORM
- **[Neon](https://neon.tech/)** - Serverless Postgres
- **[Bun](https://bun.sh/)** - JavaScript Runtime & Package Manager

### UI & Styling

- **[Tailwind CSS v4](https://tailwindcss.com/)** - Styling
- **[Base UI](https://base-ui.com/)** - Accessible Components
- **[Motion](https://motion.dev/)** - Animations
- **[Lucide Icons](https://lucide.dev/)** - Icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toasts
- **[Vaul](https://vaul.emilkowal.ski/)** - Drawer Component
- **[Tiptap](https://tiptap.dev/)** - Rich Text Editor

### Forms & Data

- **[TanStack Query](https://tanstack.com/query/latest)** - Data Fetching
- **[TanStack Form](https://tanstack.com/form/latest)** - Form Management
- **[Zod](https://zod.dev/)** - Schema Validation

### Utilities

- **[Resend](https://resend.com/)** - Email Service
- **[Nuqs](https://nuqs.47ng.com/)** - URL State Management
- **[Neverthrow](https://github.com/supermacro/neverthrow)** - Type-safe Error Handling
- **[Ultracite](https://github.com/ultracite/ultracite)** - Linting & Formatting

## Learn More

- [Better Auth Documentation](https://better-auth.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
