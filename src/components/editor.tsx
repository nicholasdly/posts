"use client";

import { ImageIcon, SmileIcon, VoteIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { createPost } from "@/server/actions";

import { Button } from "./ui/button";

export default function Editor() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    startTransition(() => {
      const promise = createPost({ content: input });
      toast.promise(promise, { error: "Something went wrong!" });
    });
  };

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
        handleSubmit();
      }}
    >
      <textarea
        id="editor"
        className="h-12 w-full resize-none rounded-3xl border px-4 py-3 text-base outline-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={isPending}
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
          disabled={input.trim().length === 0 || isPending}
        >
          Post
        </Button>
      </div>
    </form>
  );
}
