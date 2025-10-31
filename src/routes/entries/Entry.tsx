import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getEntry } from "@/lib/api/services/entries";
import PageLoading from "@/components/PageLoading";
import PageError from "@/components/PageError";

export default function EntryPage() {
  const { id } = useParams();

  const entryId = Number.parseInt(id as string, 10);

  const { data: entry, ...entryQuery } = useQuery({
    queryKey: ["entries", entryId],
    queryFn: ({ queryKey }) => {
      return getEntry(queryKey[1] as number);
    },
    enabled: !Number.isNaN(entryId),
  });

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Entry Detail</h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <div className="flex flex-col bg-bg-hard rounded-md shadow-md h-full overflow-auto w-full mx-auto">
          {entryQuery.isError && (
            <PageError>{entryQuery.error?.message}</PageError>
          )}
          {entryQuery.isLoading && <PageLoading />}
          {entryQuery.isSuccess && (
            <>
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-bold text-fg">Description</h2>
              </div>

              <div className="p-2 w-full min-h-0 flex-1 text-fg font-medium">
                {!entryQuery.isLoading && <div>{entry?.description}</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
