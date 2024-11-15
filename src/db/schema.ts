import { pgTable, unique } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t.text().notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
}));

export const likes = pgTable(
  "likes",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    postId: t.uuid().notNull(),
    userId: t.text().notNull(),
    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (t) => [unique().on(t.postId, t.userId)],
);

export const replies = pgTable("replies", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  postId: t.uuid().notNull(),
  userId: t.text().notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
}));
