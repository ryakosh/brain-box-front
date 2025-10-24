"use client";

import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";

import EntrySearchBar from "@/components/EntrySearchBar";
import EntryCard from "@/components/EntryCard";
import { deleteEntry, searchEntries } from "@/lib/api/services/entries";
import type { EntryRead } from "@/lib/api/types";
import { APIError } from "@/lib/api/errors";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmProvider";

export default function SearchPage() {
  const [results, setResults] = useState<EntryRead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { showToast } = useToast();

  const confirm = useConfirm();

  const handleDelete = useCallback(
    async (entry: EntryRead) => {
      const accepted = await confirm({
        title: "Delete this entry?",
        description: "This will permanently delete the entry.",
        confirmLabel: "Delete",
        rejectLabel: "Cancel",
      });

      if (accepted) {
        try {
          await deleteEntry(entry.id);

          setResults((prev) => prev.filter((e) => e.id !== entry.id));
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
        }
      }
    },
    [showToast, confirm],
  );

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
        <div className="flex flex-col items-center justify-center text-fg-muted text-center p-6">
          <Loader2 size={48} className="animate-spin mb-4" />
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <p className="text-center text-fg-muted p-6">
          Use the search bar below to find your entries.
        </p>
      );
    }

    if (results.length === 0) {
      return (
        <p className="text-center text-fg-muted p-6">
          No results found, try a different search term.
        </p>
      );
    }

    return (
      <div className="w-full space-y-2 overflow-auto h-full">
        {results.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Search Entries</h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <div className="flex flex-col bg-bg-hard rounded-md shadow-md h-full overflow-auto w-full mx-auto">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-fg">Results</h2>
          </div>
          <div className="p-2 w-full min-h-0 flex-1">{renderContent()}</div>
        </div>
      </div>
      <div className="my-1 mx-1">
        <EntrySearchBar onSearchChange={performSearch} />
      </div>
    </div>
  );
}
