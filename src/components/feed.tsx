"use client";

import { LoaderIcon } from "lucide-react";

import { Post as PostType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

import Post from "./post";

export default function Feed() {
  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await fetch("/api/posts");

      if (response.status === 429)
        throw Error("Rate limit exceeded! Try again later.");
      if (!response.ok) throw new Error("Something went wrong!");

      return (await response.json()) as PostType[];
    },
    staleTime: Infinity,
  });

  if (isPending) {
    return <LoaderIcon className="animate-spin text-muted-foreground" />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center text-muted-foreground">
        <p>Unable to load your feed! 😱</p>
        <p>Please try again later.</p>
      </div>
    );
  }

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
