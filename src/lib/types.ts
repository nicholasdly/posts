export type Author = {
  image: string;
  name: string | null;
  username: string | null;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  author: Author | null;
  likes: number;
  replies: number;
};
