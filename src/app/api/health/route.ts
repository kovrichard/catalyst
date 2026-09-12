import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/dao/health";
import { logger } from "@/lib/logger";

async function readDatabaseStatus(): Promise<"ok" | "unreachable"> {
  try {
    await pingDatabase();
    return "ok";
  } catch (error) {
    logger.error(`Health check could not reach the database: ${String(error)}`);
    return "unreachable";
  }
}

export async function GET() {
  const database = await readDatabaseStatus();

  return NextResponse.json(
    { app: "ok", database },
    {
      status: database === "ok" ? 200 : 503,
      headers: { "cache-control": "no-store" },
    }
  );
}
