import { ThemeProvider } from "@/components/ThemeProvider";
import BottomBar from "@/components/BottomBar";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";
import NavigationMenu from "@/components/NavigationMenu";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <ConfirmProvider>
          <div className="flex flex-col md:flex-row w-full h-full min-h-0 ">
            <div className="hidden md:flex flex-col justify-center md:w-2xs lg:w-sm h-full">
              <NavigationMenu />
            </div>

            <main className="flex-1 overflow-auto w-full min-h-0 md:p-1">
              <Outlet />
            </main>
            <div className="m-1 md:hidden">
              <BottomBar />
            </div>
          </div>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
