import { Elysia, t } from "elysia";
import { lucia } from "../../services/auth.service";
import { users } from "../../db/schema";
import { Argon2id } from "oslo/password";
import { generateRandomString, alphabet } from "oslo/crypto";
import { db } from "../../db";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      const { username, email, password } = body;

      const argon2id = new Argon2id();
      const hashedPassword = await argon2id.hash(password);
      const userId = generateRandomString(16, alphabet("a-z", "0-9"));

      try {
        const user = await db.insert(users).values({
          id: userId,
          username,
          email,
          password: hashedPassword,
        });
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        set.headers["Set-Cookie"] = sessionCookie.serialize();
      } catch (error) {
        if (error.code === "23505") {
          // PostgreSQL unique violation error code
          set.status = 409; // Conflict
          return { error: "Username or email already exists." };
        }
        set.status = 500;
        return { error: "Failed to create user." };
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 2 }), // Match the schema and require at least 2 characters
        email: t.String({ format: "email" }), // Ensures it's a valid email format
        password: t.String({ minLength: 8 }), // Enforce a minimum password length
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;
      try {
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });
        if (!user) {
          set.status = 404;

          return { error: "Incorrect email or password" };
        }
        const argon2id = new Argon2id();
        const isValidPassword = await argon2id.verify(user.password, password);
        if (!isValidPassword) {
          set.status = 401;
          return { error: "Incorrect email or password" };
        }
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        set.headers["Set-Cookie"] = sessionCookie.serialize();
      } catch (error) {
        set.status = 500;
        return { error: "Failed to login." };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  );
