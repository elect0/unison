import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
const migrationClient = postgres(connectionString, { max: 1 });
async function runMigrations() {
  console.log("⏳ Running migrations...");
  const start = Date.now();

  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/db/migrations",
  });
  const end = Date.now();
  console.log(`✅ Migrations completed in ${end - start}ms`);
  await migrationClient.end();

  process.exit(0);
}

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});
