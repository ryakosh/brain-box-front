"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { X, ArrowLeft, ChevronRight } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  action?: string | (() => void);
  subItems?: MenuItem[];
}

interface NavigationMenuProps {
  menuItems: MenuItem[];
  onClose: () => void;
}

export default function NavigationMenu({
  menuItems,
  onClose,
}: NavigationMenuProps) {
  const [history, setHistory] = useState<MenuItem[][]>([menuItems]);
  const { setTheme } = useTheme();

  const currentMenuItems = history[history.length - 1];

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      setHistory([...history, item.subItems]);
    } else if (
      typeof item.action === "string" &&
      item.action.startsWith("theme-")
    ) {
      setTheme(item.action.replace("theme-", ""));
    } else if (typeof item.action === "function") {
      item.action();
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  return (
    <div className="absolute bottom-full left-0 w-full bg-bg rounded-md shadow-md mb-1 origin-bottom-left">
      <div className="p-2">
        <header className="flex items-center justify-between pb-1 mb-1">
          <div className="flex items-center text-lg font-bold ml-1">
            {history.length > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="p-2 cursor-pointer text-fg-muted"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-md font-bold text-fg">Menu</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 text-fg-muted"
          >
            <X size={20} />
          </button>
        </header>

        <ul className="space-y-1">
          {currentMenuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className="w-full flex justify-between items-center text-left p-2 text-fg cursor-pointer"
              >
                <span>{item.label}</span>
                {item.subItems && (
                  <ChevronRight size={18} className="text-fg-muted" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
