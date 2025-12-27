import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pgPool?: Pool
};

export const pgPool =
    globalForPg.pgPool ??
    new Pool({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOSTNAME,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE
    });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pgPool;
}
