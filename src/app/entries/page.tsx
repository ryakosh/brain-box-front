"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2, Frown } from "lucide-react";

import EntrySearchBar from "@/components/EntrySearchBar";
import EntryCard from "@/components/EntryCard";
import { searchEntries } from "@/lib/api/services/entries";
import type { EntryRead } from "@/lib/api/types";
import { APIError } from "@/lib/api/errors";
import { useToast } from "@/components/Toast";

export default function SearchPage() {
  const [results, setResults] = useState<EntryRead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { showToast } = useToast();

  const performSearch = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);

      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await searchEntries(query);

      setResults(searchResults);
    } catch (err) {
      if (err instanceof APIError) {
        showToast({ id: "api-error", mode: "error", message: err.message });
      } else {
        showToast({
          id: "unexpected-error",
          mode: "error",
          message: "An unexpected error occurred",
        });
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-fg-muted text-center p-8">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-lg">Searching...</p>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="flex flex-col items-center justify-center text-fg-muted text-center p-8">
          <Search size={48} className="mb-4" />
          <p>Use the search bar below to find your entries.</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-fg-muted text-center p-8">
          <Frown size={48} className="mb-4" />
          <h2 className="text-xl font-bold text-fg">No Results Found</h2>
          <p>Try a different search term.</p>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        {results.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Search Entries</h1>
      <div className="flex flex-col h-full">
        <div className="flex-grow p-1 flex justify-center">
          <div className="w-full h-full">{renderContent()}</div>
        </div>

        <div className="my-1 mx-1">
          <EntrySearchBar onSearchChange={performSearch} />
        </div>
      </div>
    </div>
  );
}
