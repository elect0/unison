import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
const pgClient = postgres(connectionString);
const db = drizzle(pgClient, { schema });

const result = await db.execute("select 1");
console.log("Database connection test successful:", result);
export default db;
