"use client";

import TopicNavigator from '@/components/TopicNavigator';
import CreateTopicForm from '@/components/CreateTopicForm';
import type { TopicCreate } from "@/lib/api/types";
import { createTopic } from "@/lib/api/services/topics";
import { APIError } from "@/lib/api/errors";
import { useToast } from "@/components/Toast";

export default function TopicsPage() {
  const { showToast } = useToast();

  const handleSubmit = async (topicCreate: TopicCreate) => {
    try {
      await createTopic(topicCreate);
      showToast("success");
    } catch (err: unknown) {
      if (err instanceof APIError) {
        showToast("error", err.message);
      } else {
        showToast("error", "An unexpected error occurred");
      }
    }
  };
  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">
        Manage Topics
      </h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        <TopicNavigator /> 
      </div>
      <div className="my-1 mx-1">
        <CreateTopicForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

