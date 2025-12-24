import BottomBar from "@/components/BottomBar";
import NavigationMenu from "@/components/NavigationMenu";
import { Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-0 ">
      <div className="hidden md:flex flex-col justify-center md:w-2xs lg:w-sm h-full">
        <NavigationMenu onLogout={isAuthenticated ? handleLogout : undefined} />
      </div>

      <main className="flex-1 overflow-auto w-full min-h-0 md:p-1">
        <Outlet />
      </main>
      <div className="m-1 md:hidden">
        <BottomBar />
      </div>
    </div>
  );
}
