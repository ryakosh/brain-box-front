"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import NavigationMenu, { type MenuItem } from "./NavigationMenu";

export default function BottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems: MenuItem[] = [
    {
      id: "topics",
      label: "Manage Topics",
      action: () => {
        router.push("/topics");
        setIsMenuOpen(false);
      },
    },
    {
      id: "theme",
      label: "Change Theme",
      subItems: [
        { id: "theme-light", label: "Light", action: "theme-light" },
        { id: "theme-dark", label: "Dark", action: "theme-dark" },
        { id: "theme-system", label: "System", action: "theme-system" },
      ],
    },
  ];

  return (
    <div className="flex h-16">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={handleMenuToggle}
          className="w-full h-full flex rounded-md shadow-md items-center justify-center text-lg font-semibold bg-bg-hard hover:bg-bg-hard transition-colors"
        >
          <Menu size={24} />
          Menu
        </button>
        {isMenuOpen && (
          <NavigationMenu menuItems={menuItems} onClose={handleMenuToggle} />
        )}
      </div>
    </div>
  );
}
