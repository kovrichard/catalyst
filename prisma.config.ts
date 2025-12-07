import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { defineConfig } from "prisma/config";

const envs = dotenv.config();
dotenvExpand.expand(envs);

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL ?? "",
  },
});
