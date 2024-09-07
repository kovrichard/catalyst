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

Run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. An example workflow is defined in `.github/workflows/build.yml`.
It installs the dependencies, lints the code, and builds the project.
