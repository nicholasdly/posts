import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nicholasdly/posts",
  description: "A minimal microblogging platform by Nicholas Ly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("antialiased", geist.className)}>
          <Providers>
            {children}
            <Toaster theme="light" richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
