import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="flex justify-center">
      {user ? (
        <p>Hello {user.username}!</p>
      ) : (
        <p className="text-muted-foreground">You&apos;re not signed in!</p>
      )}
    </main>
  );
}
