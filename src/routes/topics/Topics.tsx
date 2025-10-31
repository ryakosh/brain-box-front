import TopicNavigator from "@/components/TopicNavigator";
import CreateTopicForm from "@/components/CreateTopicForm";
import type { TopicCreate, TopicReadWithCounts } from "@/lib/api/types";
import { createTopic, deleteTopic, getTopics } from "@/lib/api/services/topics";
import { useToast } from "@/components/Toast";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/components/ConfirmProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function TopicsPage() {
  const [parentTopic, setParentTopic] = useState<TopicReadWithCounts | null>(
    null,
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const parentId = parseInt(id ?? "", 10) || null;

  const { data: topics, ...topicsQuery } = useQuery({
    queryKey: ["topics", parentId],
    queryFn: ({ queryKey }) => getTopics(queryKey[1] as number | null),
  });

  const createTopicMutation = useMutation({
    mutationFn: (topicCreate: TopicCreate) => createTopic(topicCreate),
    onSuccess: async (topic) => {
      await queryClient.invalidateQueries({
        queryKey: ["topics", topic.parent_id],
      });

      showToast({ id: "create-topic", mode: "success" });
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
  });
  const deleteTopicMutation = useMutation({
    mutationFn: (topic: TopicReadWithCounts) => deleteTopic(topic.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["topics", variables.parent_id],
      });

      showToast({ id: "delete-topic", mode: "success" });
    },
    onError: (error) => {
      showToast({ id: "api-error", mode: "error", message: error.message });
    },
  });

  const handleTopicClick = (topic: TopicReadWithCounts) => {
    navigate(`/topics/${topic.id}`);
    setParentTopic(topic);
  };

  const handleBackClick = () => {
    navigate(-1);
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

    topicCreate.parent_id = parentId;
    createTopicMutation.mutate(topicCreate);
  };

  const handleDelete = async (topic: TopicReadWithCounts) => {
    const accepted = await confirm({
      title: "Delete this topic?",
      description:
        "This will permanently delete the topic and all of its entries, its subtopics and their entries remain intact.",
      confirmLabel: "Delete",
      rejectLabel: "Cancel",
    });

    if (accepted) {
      deleteTopicMutation.mutate(topic);
    }
  };

  if (topicsQuery.isError) {
    showToast({
      id: "api-error",
      mode: "error",
      message: topicsQuery.error.message,
    });
  }

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="font-bold text-2xl mx-1 my-3 text-fg">Manage Topics</h1>
      <div className="mx-1 mt-1 mb-3 flex-1 min-h-0">
        {topicsQuery.isLoading && (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
        {!topicsQuery.isLoading && (
          <TopicNavigator
            parentTopic={parentTopic}
            topics={topics ?? []}
            showBack={parentId !== null}
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
