import "./globals.css";

import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import BottomBar from "@/components/BottomBar";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";
import NavigationMenu from "@/components/NavigationMenu";

const inter = Inter({ subsets: ["latin"] });

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
              <div className="flex flex-col md:flex-row w-full h-full min-h-0">
                <div className="hidden md:flex flex-col justify-center md:w-2xs lg:w-sm h-full">
                  <NavigationMenu />
                </div>

                <main className="flex-1 overflow-auto min-h-0 md:p-1">
                  {children}
                </main>
                <div className="m-1 md:hidden">
                  <BottomBar />
                </div>
              </div>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
