"use client";

import { ImageIcon, SmileIcon, VoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Post } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "./ui/button";

export default function Editor() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 400) throw new Error("Invalid post!");
      if (response.status === 401) throw Error("Please sign in to make posts!");
      if (response.status === 429)
        throw Error("Rate limit exceeded! Try again later.");
      if (!response.ok) throw new Error("Something went wrong!");

      return (await response.json()) as { id: string };
    },
    onMutate: async (data) => {
      setInput("");

      // Cancel any outgoing refetches so they don't overwrite our optimistic update.
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      // Save the previous state of the feed to restore if there's an error.
      const previousPosts = queryClient.getQueryData<Post[]>(["feed"]);

      // Don't do anything if the user is not signed in.
      // Generally shouldn't happen since they need to be authenticated to make posts.
      if (!user) return;

      // Optimistically update feed.
      queryClient.setQueryData(["feed"], (old: Post[]) => [
        {
          id: Math.random().toString(),
          userId: user.id,
          content: data.content,
          createdAt: new Date(),
          author: {
            image: user.imageUrl,
            name: user.fullName,
            username: user.username,
          },
          likes: 0,
          replies: 0,
        },
        ...old,
      ]);

      // Return a context object with the previous state of the feed.
      return { previousPosts };
    },
    onError: (error, _, context) => {
      // Rollback to the previous state of the feed.
      queryClient.setQueryData(["feed"], context?.previousPosts);
      toast.error(error.message);
    },
  });

  // Adjusts the height of the `textarea` to fit its content.
  useEffect(() => {
    const editor = document.getElementById("editor") as HTMLTextAreaElement;
    editor.style.height = "auto";
    editor.style.height = editor.scrollHeight + "px";
  }, [input]);

  return (
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        createPost({ content: input });
      }}
    >
      <textarea
        id="editor"
        className="h-12 w-full resize-none rounded-3xl border px-4 py-3 text-base outline-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="What's up?"
        maxLength={200}
        rows={1}
        autoFocus
        spellCheck
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            type="button"
            disabled
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            type="button"
            disabled
          >
            <VoteIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            type="button"
            disabled
          >
            <SmileIcon className="size-4" />
          </Button>
        </div>
        <Button
          size="sm"
          className="self-end rounded-full font-semibold"
          type="submit"
          disabled={input.trim().length === 0}
        >
          Post
        </Button>
      </div>
    </form>
  );
}
