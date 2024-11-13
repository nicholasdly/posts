"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error.message === "TOO_MANY_REQUESTS") {
    return (
      <main>
        <div className="flex flex-col items-center text-muted-foreground">
          <p>Rate limit exceeded! 😡</p>
          <p>Come back another time.</p>
          <Button variant="default" size="sm" className="mt-3" onClick={reset}>
            Refresh
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex flex-col items-center text-muted-foreground">
        <p>Something went wrong! 😱</p>
        <p>An error has occurred, try again later.</p>
        <Button variant="default" size="sm" className="mt-3" onClick={reset}>
          Refresh
        </Button>
      </div>
    </main>
  );
}
