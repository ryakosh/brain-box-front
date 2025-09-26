"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { TopicReadWithCounts } from "@/lib/api/types";
import { getTopics } from "@/lib/api/services/topics";

interface HistoryEntry {
  id: number | null;
  name: string;
}

export default function TopicNavigator() {
  const [currentView, setCurrentView] = useState<HistoryEntry>({
    id: null,
    name: "All Topics",
  });
  const [displayedTopics, setDisplayedTopics] = useState<TopicReadWithCounts[]>(
    [],
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (topicId: number | null) => {
    setIsLoading(true);

    try {
      const topics = await getTopics(topicId);

      setDisplayedTopics(topics);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

  const handleTopicClick = useCallback(
    (topic: TopicReadWithCounts) => {
      if (topic.children_count && topic.children_count > 0) {
        setHistory((prev) => [...prev, currentView]);
        const nextView = { id: topic.id, name: topic.name };
        setCurrentView(nextView);
        fetchData(topic.id);
      }
    },
    [currentView, fetchData],
  );

  const handleBackClick = useCallback(() => {
    if (history.length === 0) return;

    const previousView = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));
    setCurrentView(previousView);
    fetchData(previousView.id);
  }, [history, fetchData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin" size={32} />
        </div>
      );
    }
    if (displayedTopics.length === 0) {
      return <p className="text-center text-fg-muted p-6">No subtopics.</p>;
    }
    return (
      <ul className="space-y-1 overflow-auto h-full">
        {displayedTopics.map((topic) => {
          const isClickable = (topic.children_count ?? 0) > 0;

          return (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => handleTopicClick(topic)}
                disabled={!isClickable}
                className={`w-full flex items-center justify-between text-left p-3 rounded-md transition-colors ${isClickable
                    ? "cursor-pointer hover:bg-bg-soft"
                    : "cursor-default"
                  }`}
              >
                <span className="text-fg">{topic.name}</span>
                {isClickable && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-fg-muted">
                      {topic.children_count}
                    </span>
                    <ChevronRight size={18} className="text-fg-muted" />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={
        "flex flex-col bg-bg-hard rounded-md shadow-md h-full w-full mx-auto"
      }
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleBackClick}
              className="p-1 cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="text-fg-muted" size={20} />
            </button>
          )}
          <h2 className="text-lg font-bold text-fg">{currentView.name}</h2>
        </div>
        {!isLoading && (
          <span className="text-sm font-medium bg-fg-soft text-fg-muted px-2 py-1 rounded-md">
            {displayedTopics.length}
          </span>
        )}
      </div>

      <div className="p-2 w-full min-h-0 flex-1">{renderContent()}</div>
    </div>
  );
}
