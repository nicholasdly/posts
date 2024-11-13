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

  const posts = await db
    .select()
    .from(schema.posts)
    .orderBy(desc(schema.posts.createdAt))
    .limit(50);

  const promises = posts.map(async (post) => {
    const author = await clerk.users.getUser(post.userId);
    return {
      ...post,
      author: {
        image: author.imageUrl,
        name: author.fullName,
        username: author.username,
      },
    };
  });

  return Promise.all(promises);
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
