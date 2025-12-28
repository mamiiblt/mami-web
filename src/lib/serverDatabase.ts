import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
    pgPool?: Pool;
};

export const pgPool =
    globalForPg.pgPool ??
    new Pool({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host:
            process.env.NODE_ENV === "development"
                ? process.env.DB_HOSTNAME_PUBLIC
                : process.env.DB_HOSTNAME_INTERNAL,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 2_000,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg.pgPool = pgPool;
}