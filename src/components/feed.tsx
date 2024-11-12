import { InferSelectModel } from "drizzle-orm";

import db from "@/db";
import { posts } from "@/db/schema";

function Post(post: InferSelectModel<typeof posts>) {
  return <article>{post.content}</article>;
}

export default async function Feed() {
  const posts = await db.query.posts.findMany({ limit: 50 });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center text-muted-foreground">
        <p>Looks like you&apos;re the first one here. 👀</p>
        <p>Make a post to break the silence!</p>
      </div>
    );
  }

  return (
    <section>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </section>
  );
}
