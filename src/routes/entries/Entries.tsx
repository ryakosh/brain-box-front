import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import EntrySearchBar from "@/components/EntrySearchBar";
import EntryCard from "@/components/EntryCard";
import { deleteEntry, searchEntries } from "@/lib/api/services/entries";
import type { EntryRead } from "@/lib/api/types";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageError from "@/components/PageError";
import PageLoading from "@/components/PageLoading";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("q") ?? "",
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { data: entries, ...entriesQuery } = useQuery({
    queryKey: ["entries", debouncedSearchTerm],
    queryFn: ({ queryKey }) => searchEntries(queryKey[1]),
    staleTime: 0,
    gcTime: 0,
    enabled: debouncedSearchTerm?.length >= 3,
  });

  useEffect(() => {
    if (entries && entries.length > 0) {
      setSearchParams({ q: searchTerm }, { replace: true });
    }
  }, [entries, setSearchParams, searchTerm]);

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

  const handleSearchChange = async (st: string) => {
    setSearchTerm(st);
  };

  const renderContent = () => {
    if (searchTerm.length <= 2) {
      return (
        <p className="text-center text-fg-muted p-6 text-md md:text-lg">
          Use the search bar below to find your entries.
        </p>
      );
    }

    if (entries?.length === 0) {
      return (
        <p className="text-center text-fg-muted p-6 text-md md:text-lg">
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
      <h1 className="font-bold text-xl md:text-2xl mx-1 my-3 text-fg">
        Search Entries
      </h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <div className="flex flex-col bg-bg-hard rounded-md shadow-md h-full overflow-auto w-full mx-auto">
          {entriesQuery.isLoading && !entries && <PageLoading />}
          {!entriesQuery.isLoading && (
            <>
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg md:text-xl font-bold text-fg">
                  Results
                </h2>
              </div>
              <div className="p-2 w-full min-h-0 flex-1">{renderContent()}</div>
            </>
          )}
          {entriesQuery.isError && (
            <PageError>{entriesQuery.error?.message}</PageError>
          )}
        </div>
      </div>
      <div className="my-1 mx-1">
        <EntrySearchBar onChange={handleSearchChange} value={searchTerm} />
      </div>
    </div>
  );
}
