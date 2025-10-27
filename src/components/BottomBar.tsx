import { useState } from "react";
import { Menu } from "lucide-react";

import NavigationMenu from "@/components/NavigationMenu";

export default function BottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
        {isMenuOpen && <NavigationMenu onClose={handleMenuToggle} />}
      </div>
    </div>
  );
}
