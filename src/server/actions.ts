"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import db from "@/db";
import * as schema from "@/db/schema";
import { createPostSchema } from "@/lib/zod";
import { auth } from "@clerk/nextjs/server";

import clerk from "./clerk";
import { ratelimits } from "./ratelimit";

export async function getPosts() {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimits.getPosts.limit(ip);
  if (!success) throw Error("TOO_MANY_REQUESTS");

  const count = 50;

  const posts = await db
    .select()
    .from(schema.posts)
    .orderBy(desc(schema.posts.createdAt))
    .limit(count);

  const { data: users } = await clerk.users.getUserList({
    userId: posts.map((post) => post.userId),
    limit: count,
  });

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.userId);

    if (!author) return { ...post, author: null };

    return {
      ...post,
      author: {
        image: author.imageUrl,
        name: author.fullName,
        username: author.username,
      },
    };
  });
}

export async function createPost(body: z.infer<typeof createPostSchema>) {
  const { userId } = await auth();
  if (!userId) throw Error("UNAUTHORIZED");

  const fields = await createPostSchema.safeParseAsync(body);
  if (!fields.success) throw Error("BAD_REQUEST");

  const { success } = await ratelimits.createPost.limit(userId);
  if (!success) throw Error("TOO_MANY_REQUESTS");

  const [post] = await db
    .insert(schema.posts)
    .values({
      userId,
      content: fields.data.content,
    })
    .returning();

  revalidatePath("/");
  return post;
}
