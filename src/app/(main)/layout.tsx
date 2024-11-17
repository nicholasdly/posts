import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-lg p-4">
      <header className="mb-6 flex items-center justify-between">
        <Button variant="link" className="h-fit justify-self-start p-0" asChild>
          <Link href="/">
            <h1 className="flex items-baseline gap-2 text-xl font-semibold">
              nicholasdly/posts
            </h1>
          </Link>
        </Button>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </SignedOut>
      </header>
      {children}
    </div>
  );
}
