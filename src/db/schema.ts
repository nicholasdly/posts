import { pgTable } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t.text().notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
}));
