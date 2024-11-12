"use server";

import { revalidatePath } from "next/cache";

import db from "@/db";
import * as schema from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getPosts() {
  const posts = await db.query.posts.findMany({
    limit: 50,
  });

  return posts;
}

export async function createPost({ content }: { content: string }) {
  const { userId } = await auth();

  if (!userId) throw Error("UNAUTHORIZED");

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
