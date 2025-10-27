import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useOnClickOutside } from "@/lib/hooks";

interface EntrySearchBarProps {
  onSearchChange: (query: string) => void;
}

export default function EntrySearchBar({
  onSearchChange,
}: EntrySearchBarProps) {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsActive(false));

  useEffect(() => {
    onSearchChange(query);
  }, [query, onSearchChange]);

  const handleActivate = () => {
    setIsActive(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClear = () => {
    setQuery("");
  };

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={handleActivate}
        className="w-full flex items-center justify-center gap-1 px-4 py-3 h-14 bg-accent-orange text-lg font-semibold rounded-md hover:bg-accent-orange/90 transition-all duration-200 cursor-pointer"
      >
        <Search size={20} />
        <span>Search Entries...</span>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search entries..."
        className="w-full bg-accent-orange h-14 text-lg rounded-md py-3 pl-10 pr-10 focus:outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
