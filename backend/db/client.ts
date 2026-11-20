import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is always defined so Prisma never crashes with 'Environment variable not found'
if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL) {
    // In Vercel serverless environment, bundled filesystem is read-only.
    // Copy the database file to /tmp (which is writable) if it doesn't exist yet.
    const tmpDb = path.join("/tmp", "dev.db");
    const sourceDb = path.resolve("./prisma/dev.db");

    if (!fs.existsSync(tmpDb) && fs.existsSync(sourceDb)) {
      try {
        fs.copyFileSync(sourceDb, tmpDb);
      } catch (err) {
        console.warn("Could not copy dev.db to /tmp:", err);
      }
    }

    process.env.DATABASE_URL = fs.existsSync(tmpDb)
      ? `file:${tmpDb}`
      : "file:./dev.db";
  } else {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
