import Image from "next/image";

import dayjs from "@/lib/dayjs";
import { getPosts } from "@/server/actions";

function Post(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  if (!post.author) {
    return (
      <article className="rounded-lg border bg-muted p-3">
        <p className="text-muted-foreground">
          This post is no longer available.
        </p>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-full">
            <Image
              src={post.author.image}
              alt={`@${post.author.username}'s profile picture`}
              width={48}
              height={48}
            />
          </div>
        <div className="flex flex-col">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">@{post.author.username}</span>
            &nbsp;•&nbsp;
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </p>
        </div>
      </div>
      <p className="whitespace-pre-line">{post.content}</p>
    </article>
  );
}

export default async function Feed() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center text-muted-foreground">
        <p>Looks like you&apos;re the first one here. 👀</p>
        <p>Make a post to break the silence!</p>
      </div>
    );
  }

  return (
    <section className="w-full space-y-3">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </section>
  );
}
