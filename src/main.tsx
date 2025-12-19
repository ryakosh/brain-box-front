import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import "@/styles/globals.css";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import type { EntryCreate } from "@/lib/api/types";
import { createEntry } from "@/lib/api/services/entries";
import { onlineManager } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";

const HEALTH_CHECK_URL = "/api/health";

onlineManager.setOnline(false);
onlineManager.setEventListener((setOnline) => {
  const checkApiStatus = async () => {
    try {
      const response = await fetch(HEALTH_CHECK_URL, {
        method: "HEAD",
        cache: "no-store",
      });

      return response.ok;
    } catch (_) {
      return false;
    }
  };

  const interval = setInterval(async () => {
    const isOnline = await checkApiStatus();
    setOnline(isOnline);
  }, 5000);

  const onlineHandler = () => checkApiStatus().then(setOnline);
  window.addEventListener("online", onlineHandler);

  const offlineHandler = () => setOnline(false);
  window.addEventListener("offline", offlineHandler);

  return () => {
    clearInterval(interval);
    window.removeEventListener("online", onlineHandler);
    window.removeEventListener("offline", offlineHandler);
  };
});

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
      retry: 0,
    },

    mutations: {
      retry: true,
      gcTime: Infinity,
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                  persister,
                  maxAge: Infinity,
                  dehydrateOptions: {
                    shouldDehydrateQuery: (query) =>
                      query.state.status === "success" ||
                      (query.state.status === "error" && !!query.state.data),
                  },
                }}
                onSuccess={() => {
                  queryClient.resumePausedMutations().then(() => {
                    queryClient.invalidateQueries();
                  });
                }}
              >
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
              </PersistQueryClientProvider>
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
