import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import "@/styles/globals.css";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import type { EntryCreate } from "./lib/api/types";
import { createEntry } from "./lib/api/services/entries";

const idbStorage = {
  setItem: (key: string, value: any) => set(key, value),
  getItem: (key: string) => get(key),
  removeItem: (key: string) => del(key),
};

const persister = createAsyncStoragePersister({
  storage: idbStorage,
  key: "APP_CACHE",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 0,
      networkMode: "offlineFirst",
    },

    mutations: {
      retry: true,
      gcTime: Infinity,
      networkMode: "always",
    },
  },
});

queryClient.setMutationDefaults(["entries"], {
  mutationFn: async (entry: EntryCreate) => {
    return createEntry(entry);
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: Infinity }}
        onSuccess={() => {
          queryClient.resumePausedMutations().then(() => {
            queryClient.invalidateQueries();
          });
        }}
      >
        <App />
      </PersistQueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
