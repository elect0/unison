import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  date,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// GROUPS & MEMBERSHIP

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  inviteCode: varchar("invite_code", { length: 9 }).unique().notNull(),
  createdById: integer("created_by_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["admin", "member"] })
      .default("member")
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  })
);

// CONTENT MANAGEMENT

export const questionPacks = pgTable("question_packs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  packId: integer("pack_id")
    .notNull()
    .references(() => questionPacks.id, { onDelete: "cascade" }),
});

// GAMEPLAY & HISTORY
export const groupSubscriptions = pgTable("group_subscriptions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  packId: integer("pack_id")
    .notNull()
    .references(() => questionPacks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyQuestions = pgTable(
  "daily_questions",
  {
    id: serial("id").primaryKey(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
  },
  (t) => ({
    // A group can only have one question per day
    unq: uniqueIndex("unq_group_date").on(t.groupId, t.date),
  })
);

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  dailyQuestionId: integer("daily_question_id")
    .notNull()
    .references(() => dailyQuestions.id, { onDelete: "cascade" }),
  voterId: integer("voter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  votedForId: integer("voted_for_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  usersToGroups: many(usersToGroups),
}));

export const groupRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  usersToGroups: many(usersToGroups),
  subscriptions: many(groupSubscriptions),
}));

export const usersToGroupRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, { fields: [usersToGroups.userId], references: [users.id] }),
}));

export const questionPackRelations = relations(questionPacks, ({ many }) => ({
  questions: many(questions),
  subscriptions: many(groupSubscriptions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  pack: one(questionPacks, {
    fields: [questions.packId],
    references: [questionPacks.id],
  }),
  dailyQuestions: many(dailyQuestions),
}));

export const dailyQuestionsRelations = relations(
  dailyQuestions,
  ({ one, many }) => ({
    group: one(groups, {
      fields: [dailyQuestions.groupId],
      references: [groups.id],
    }),
    question: one(questions, {
      fields: [dailyQuestions.questionId],
      references: [questions.id],
    }),
    votes: many(votes),
  })
);

export const votesRelations = relations(votes, ({ one }) => ({
  dailyQuestion: one(dailyQuestions, {
    fields: [votes.dailyQuestionId],
    references: [dailyQuestions.id],
  }),
  voter: one(users, {
    fields: [votes.voterId],
    references: [users.id],
    relationName: "voter",
  }),
  votedFor: one(users, {
    fields: [votes.votedForId],
    references: [users.id],
    relationName: "voted for",
  }),
}));
