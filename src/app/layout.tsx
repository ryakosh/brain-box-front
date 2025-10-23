import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import BottomBar from "@/components/BottomBar";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brain Box",
  description: "A simple app to log what you've learned.",
  // manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} w-screen h-screen flex flex-col justify-between bg-bg-soft`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <ConfirmProvider>
              <main className="flex-1 overflow-auto min-h-0">{children}</main>
              <div className="m-1">
                <BottomBar />
              </div>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
