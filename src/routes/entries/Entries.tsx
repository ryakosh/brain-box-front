import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";

import EntrySearchBar from "@/components/EntrySearchBar";
import EntryCard from "@/components/EntryCard";
import { deleteEntry, searchEntries } from "@/lib/api/services/entries";
import type { EntryRead } from "@/lib/api/types";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { data: entries, ...entriesQuery } = useQuery({
    queryKey: ["entries", searchTerm],
    queryFn: ({ queryKey }) => searchEntries(queryKey[1]),
    staleTime: 0,
    gcTime: 0,
    enabled: searchTerm?.length >= 3,
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (entry: EntryRead) => deleteEntry(entry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entries", searchTerm],
      });

      showToast({ id: "delete-entry", mode: "success" });
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
  });

  const handleEntryClick = (entry: EntryRead) => {
    navigate(`${entry.id}`);
  };

  const handleEntryDelete = async (entry: EntryRead) => {
    const accepted = await confirm({
      title: "Delete this entry?",
      description: "This will permanently delete the entry.",
      confirmLabel: "Delete",
      rejectLabel: "Cancel",
    });

    if (accepted) {
      deleteEntryMutation.mutate(entry);
    }
  };

  const handleSearchChange = useDebouncedCallback(async (st: string) => {
    setSearchTerm(st);
  }, 300);

  const renderContent = () => {
    if (searchTerm.length <= 2) {
      return (
        <p className="text-center text-fg-muted p-6">
          Use the search bar below to find your entries.
        </p>
      );
    }

    if (entries?.length === 0) {
      return (
        <p className="text-center text-fg-muted p-6">
          No results found, try a different search term.
        </p>
      );
    }

    return (
      <div className="w-full space-y-2 overflow-auto h-full">
        {entries?.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={handleEntryClick}
            onDelete={handleEntryDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Search Entries</h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <div className="flex flex-col bg-bg-hard rounded-md shadow-md h-full overflow-auto w-full mx-auto">
          {entriesQuery.isError && (
            <PageError>{entriesQuery.error?.message}</PageError>
          )}
          {entriesQuery.isLoading && <PageLoading />}
          {
            <>
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-bold text-fg">Results</h2>
              </div>
              <div className="p-2 w-full min-h-0 flex-1">{renderContent()}</div>
            </>
          }
        </div>
      </div>
      <div className="my-1 mx-1">
        <EntrySearchBar onSearchChange={handleSearchChange} />
      </div>
    </div>
  );
}
