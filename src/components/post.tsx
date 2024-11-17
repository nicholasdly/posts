"use client";

import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";

import dayjs from "@/lib/dayjs";
import { Post as PostType } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

import { Button } from "./ui/button";

function LikeButton(post: PostType) {
  return (
    <Button
      className="group gap-0 rounded-full p-0 hover:bg-inherit [&_svg]:size-5"
      variant="ghost"
      size="sm"
      onClick={(event) => {
        event.stopPropagation();
        // handleLike();
      }}
    >
      <div className="rounded-full p-2 transition-colors group-hover:bg-blue-100">
        <ThumbsUpIcon className="transition-colors group-hover:stroke-blue-500" />
      </div>
      <span className="pr-2 text-sm font-semibold transition-colors group-hover:text-blue-500">
        {formatNumber(post.likes)}
      </span>
    </Button>
  );
}

function ReplyButton(post: PostType) {
  return (
    <Button
      className="group gap-0 rounded-full p-0 hover:bg-inherit [&_svg]:size-5"
      variant="ghost"
      size="sm"
      onClick={(event) => {
        event.stopPropagation();
        // handleReply();
      }}
    >
      <div className="rounded-full p-2 transition-colors group-hover:bg-green-100">
        <MessageCircleIcon className="transition-colors group-hover:stroke-green-500" />
      </div>
      <span className="pr-2 text-sm font-semibold transition-colors group-hover:text-green-500">
        {formatNumber(post.replies)}
      </span>
    </Button>
  );
}

export default function Post(post: PostType) {
  // const router = useRouter();

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
    <article
      className="flex flex-col gap-3 rounded-lg border p-3"
      // onClick={() => router.push(`/post/${post.id}`)}
    >
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
      <div className="hidden items-center justify-evenly">
        <LikeButton {...post} />
        <ReplyButton {...post} />
      </div>
    </article>
  );
}
