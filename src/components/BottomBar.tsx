import { useState } from "react";
import { Menu } from "lucide-react";

import NavigationMenu from "@/components/NavigationMenu";
import { useAuth } from "@/context/AuthContext";

export default function BottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  // TODO: Remove logout and navigation logic duplication
  return (
    <div className="flex h-16">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={handleMenuToggle}
          className="w-full h-full flex rounded-md shadow-md items-center justify-center text-lg font-semibold bg-bg-hard hover:bg-bg-hard transition-colors cursor-pointer text-fg"
        >
          <Menu size={24} />
          Menu
        </button>

        {isMenuOpen && (
          <NavigationMenu
            onLogout={isAuthenticated ? handleLogout : undefined}
            onClose={handleMenuToggle}
          />
        )}
      </div>
    </div>
  );
}
