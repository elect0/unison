import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { users, sessions } from "../db/schema";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (databaseUserAttributes) => {
    return {
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
      avatar_url: databaseUserAttributes.avatarUrl,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  // Renamed from UserAttributes to DatabaseUserAttributes
  username: string;
  email: string;
  avatarUrl: string | null;
}
