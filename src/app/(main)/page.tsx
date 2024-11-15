import Editor from "@/components/editor";
import Feed from "@/components/feed";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="flex flex-col items-center gap-4">
      {user && <Editor />}
      <Feed />
    </main>
  );
}
