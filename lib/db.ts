import mysql, {
  type Pool,
  type RowDataPacket,
  type ResultSetHeader,
} from "mysql2/promise";

/**
 * Single shared MariaDB/MySQL connection pool.
 *
 * Env vars (match the docker-compose service names used in deployment):
 *   DATABASE_HOST     - internal DNS name of the db container (e.g. "db")
 *   DATABASE_PORT     - default 3306
 *   DATABASE_USER     - default "root"
 *   DATABASE_PASSWORD
 *   DATABASE_NAME     - default "portofolio"
 */
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST ?? "localhost",
      port: Number(process.env.DATABASE_PORT ?? 3306),
      user: process.env.DATABASE_USER ?? "root",
      password: process.env.DATABASE_PASSWORD ?? "",
      database: process.env.DATABASE_NAME ?? "portofolio",
      waitForConnections: true,
      connectionLimit: 10,
      // Wait at most a few seconds so a missing DB at build time
      // fails fast and the fallback data can take over.
      connectTimeout: 5000,
    });
  }
  return pool;
}

/** Run a SELECT and return typed rows. */
export async function query<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

/** Run an INSERT/UPDATE/DELETE and return the result header. */
export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<ResultSetHeader> {
  const [result] = await getPool().query<ResultSetHeader>(sql, params);
  return result;
}
