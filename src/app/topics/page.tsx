"use client";

import TopicNavigator from "@/components/TopicNavigator";
import CreateTopicForm from "@/components/CreateTopicForm";
import type { TopicCreate, TopicReadWithCounts } from "@/lib/api/types";
import { createTopic, deleteTopic, getTopics } from "@/lib/api/services/topics";
import { APIError } from "@/lib/api/errors";
import { useToast } from "@/components/Toast";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { compareTopicByName, insertTopic } from "./utils";
import { useConfirm } from "@/components/ConfirmProvider";

interface HistoryEntry {
  id: number | null;
  title: string;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicReadWithCounts[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchTopics = useCallback(
    async (topicId: number | null) => {
      setIsLoading(true);

      try {
        const topics = await getTopics(topicId);

        setTopics(topics);
      } catch (err: unknown) {
        if (err instanceof APIError) {
          showToast({ id: "api-error", mode: "error", message: err.message });
        } else {
          showToast({
            id: "unexpected-error",
            mode: "error",
            message: "An unexpected error occurred",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    const prevHistoryEntry = history.at(-1);

    fetchTopics(prevHistoryEntry?.id ?? null);
  }, [fetchTopics, history]);

  const handleTopicClick = (topic: TopicReadWithCounts) => {
    if (topic.children_count && topic.children_count > 0) {
      setHistory((prev) => [...prev, { id: topic.id, title: topic.name }]);
    }
  };

  const handleBackClick = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async (topicCreate: TopicCreate) => {
    if (!topicCreate.name.trim()) {
      showToast({
        id: "create-topic",
        mode: "error",
        message: "Please name your topic",
      });

      return;
    }

    try {
      const topic = await createTopic(topicCreate);
      showToast({ id: "create-topic", mode: "success" });

      setTopics((prev) =>
        insertTopic(
          prev,
          { ...topic, children_count: 0, entries_count: 0 },
          compareTopicByName,
        ),
      );
    } catch (err: unknown) {
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
  };

  const handleDelete = async (topic: TopicReadWithCounts) => {
    const accepted = await confirm({
      title: "Delete this topic?",
      description:
        "This will permanently delete the topic, its subtopics and all of its entries.",
      confirmLabel: "Delete",
      rejectLabel: "Cancel",
    });

    if (accepted) {
      try {
        await deleteTopic(topic.id);

        setTopics((prev) => prev.filter((t) => t.id !== topic.id));
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
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Manage Topics</h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        {isLoading && (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
        {!isLoading && (
          <TopicNavigator
            title={history.at(-1)?.title ?? "Root Topics"}
            topics={topics}
            onTopicClick={handleTopicClick}
            onBackClick={handleBackClick}
            onDelete={handleDelete}
          />
        )}
      </div>
      <div className="my-1 mx-1">
        <CreateTopicForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
