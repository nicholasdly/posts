"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import * as schema from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

import clerk from "./clerk";
import { ratelimits } from "./ratelimit";
import { headers } from "next/headers";

export async function getPosts() {
  const headerStore = await headers()
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimits.getPosts.limit(ip);
  if (!success) return { error: "Too many requests! Please try again later." };
  
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

export async function createPost({ content }: { content: string }) {
  const { userId } = await auth();
  if (!userId) throw Error("UNAUTHORIZED");

  const { success } = await ratelimits.createPost.limit(userId);
  if (!success) return { error: "Too many requests! Please try again later." };

  const [post] = await db
    .insert(schema.posts)
    .values({
      userId,
      content,
    })
    .returning();

  revalidatePath("/");
  return post;
}
