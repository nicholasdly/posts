import { countDistinct, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import * as schema from "@/db/schema";
import clerk from "@/lib/clerk";
import { ratelimits } from "@/lib/redis";
import { createPostSchema } from "@/lib/zod";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";

  const { success } = await ratelimits.getPosts.limit(ip);
  if (!success) return new NextResponse(null, { status: 429 });

  const limit = 50;

  const posts = await db
    .select({
      id: schema.posts.id,
      userId: schema.posts.userId,
      content: schema.posts.content,
      createdAt: schema.posts.createdAt,
      likes: countDistinct(schema.likes.id),
      replies: countDistinct(schema.replies.id),
    })
    .from(schema.posts)
    .leftJoin(schema.likes, eq(schema.posts.id, schema.likes.postId))
    .leftJoin(schema.replies, eq(schema.posts.id, schema.replies.postId))
    .groupBy(schema.posts.id)
    .orderBy(desc(schema.posts.createdAt))
    .limit(limit);

  const { data: users } = await clerk.users.getUserList({
    userId: posts.map((post) => post.userId),
    limit: limit,
  });

  const postsWithAuthors = posts.map((post) => {
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

  return NextResponse.json(postsWithAuthors, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse(null, { status: 401 });

  const body = await request.json();
  const fields = await createPostSchema.safeParseAsync(body);
  if (!fields.success) return new NextResponse(null, { status: 400 });

  const { success } = await ratelimits.createPost.limit(userId);
  if (!success) return new NextResponse(null, { status: 429 });

  const [post] = await db
    .insert(schema.posts)
    .values({
      userId,
      content: fields.data.content,
    })
    .returning();

  return NextResponse.json({ id: post.id }, { status: 200 });
}
