import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
