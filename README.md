# <img src="src/app/icon.png" alt="Catalyst Starter Kit" width="28" height="28" /> Catalyst Starter Kit

![GitHub Workflow Status](https://github.com/kovrichard/catalyst/actions/workflows/build.yml/badge.svg)

This repository provides a powerful starter kit for building modern web applications using the following stack:

- [Bun.js](https://bun.sh/): A fast JavaScript runtime for modern web applications.
- [Prisma](https://www.prisma.io/): A next-generation ORM for TypeScript and JavaScript that simplifies database access.
- [Next.js](https://nextjs.org/): A full-stack React framework for building server-side rendered applications.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for building responsive designs.
- [shadcn/ui](https://ui.shadcn.com/): A collection of beautifully designed UI components built with Tailwind CSS.
- [Husky](https://typicode.github.io/husky/): Git hooks that help to enforce coding standards by running scripts during the commit process.
- [Biome](https://biomejs.dev/): A toolchain for linting, formatting, and other code quality tasks.
- [Auth.js](https://authjs.dev): A simple and open-source authentication library for modern web applications.

## Getting Started

### Prerequisites

Ensure that you have the following tools installed on your machine:

- [Bun](https://bun.sh): Install Bun via the command line by running:

```bash
curl -fsSL https://bun.sh/install | bash
```

or

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Or if you prefer, you can use other package managers like npm, yarn, or pnpm.

### Development

Copy the [`.env.sample`](.env.sample) file to `.env` to set up the environment variables. Then, run the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying [`src/app/(public)/page.tsx`](<src/app/(public)/page.tsx>). The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Database

The Catalyst starter kit uses Prisma to interact with the database. By default, it uses PostgreSQL as the database engine.

To set up a local database for development, you can use Docker:

```bash
docker compose up -d
```

This command starts a PostgreSQL database in a Docker container and lets it run in the background.

You can find the database connection URL in the [`.env.sample`](.env.sample) file.

There is already a `User` model defined in [`prisma/schema.prisma`](prisma/schema.prisma). The correspondent migration file is located in [`prisma/migrations/`](prisma/migrations/). To create the database schema and generate the Prisma client, run:

```bash
bun run migrate
```

## Authentication

The Catalyst starter kit uses Auth.js for authentication. You can find the authentication logic in [`src/auth.ts`](src/auth.ts).

By default, a development secret is already set in the [`.env.sample`](.env.sample) file called `AUTH_SECRET`. Set this secret to a more secure random string at the hosting provider of your choice when deploying the application.

If you also need Google login, add your Google OAuth client ID and secret to the [`.env`](.env) file.

All of these environment variables have placeholders if you copied the [`.env.sample`](.env.sample) file.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. An example workflow is defined in [`.github/workflows/build.yml`](.github/workflows/build.yml).
It installs the dependencies, lints the code, and builds the project.

## SEO

The project is configured to have a `robots.txt`, a `sitemap.xml`, and a `manifest.webmanifest` file. However, these files cannot be found directly in the repository. Instead, you can find TypeScript files with similar names in the [`src/app`](src/app) directory. Edit them to fit your app. These files use the [Metadata API from Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata).

Set the `FRONTEND_URL` environment variable in the [`.env`](.env) file to the URL of your application. This variable is used in the `robots.txt` and `sitemap.xml` files.

It also sets various SEO-related tags in the root [`layout.tsx`](src/app/layout.tsx) file. Modify and extend these tags to fit your application's needs.
